// deno-lint-ignore-file no-explicit-any
import { merge } from "@fathym/common";
import { denoKv } from "../../configs/deno-kv.config.ts";
import { listenQueueAtomic } from "../../src/utils/deno-kv/helpers.ts";
import { EaCCommitRequest } from "../../src/api/models/EaCCommitRequest.ts";
import {
  markEaCProcessed,
  waitOnEaCProcessing,
} from "../../src/utils/eac/helpers.ts";
import { UserEaCRecord } from "../../src/api/UserEaCRecord.ts";
import { EverythingAsCode } from "../../src/eac/EverythingAsCode.ts";
import { EaCStatus } from "../../src/api/models/EaCStatus.ts";
import { EaCStatusProcessingTypes } from "../../src/api/models/EaCStatusProcessingTypes.ts";
import { EaCMetadataBase } from "../../src/eac/EaCMetadataBase.ts";
import {
  EaCHandlerResponse,
  isEaCHandlerResponse,
} from "../../src/api/models/EaCHandlerResponse.ts";
import { EaCHandlerRequest } from "../../src/api/models/EaCHandlerRequest.ts";
import { OperationState, SimplePollerLike } from "npm:@azure/core-lro";
import { DeploymentsCreateOrUpdateResponse } from "npm:@azure/arm-resources";
import { EaCHandlerErrorResponse } from "../../src/api/models/EaCHandlerErrorResponse.ts";
import { isEaCHandlerErrorResponse } from "../../src/api/models/EaCHandlerErrorResponse.ts";
import { EaCCloudDeployment } from "../../src/api/models/EaCCloudDeployment.ts";
import { EaCHandlerCheckRequest } from "../../src/api/models/EaCHandlerCheckRequest.ts";

export async function handleEaCCommitRequest(commitReq: EaCCommitRequest) {
  if (!commitReq.EaC.EnterpriseLookup) {
    throw new Error("The enterprise lookup must be provided.");
  }

  if (commitReq.EaC.Details && !commitReq.EaC.Details!.Description) {
    commitReq.EaC.Details.Description = commitReq.EaC.Details.Name;
  }

  const { EnterpriseLookup, ParentEnterpriseLookup, Details, ...eacDiff } =
    commitReq.EaC;

  const status = await denoKv.get<EaCStatus>([
    "EaC",
    "Status",
    "ID",
    commitReq.CommitID,
  ]);

  await waitOnEaCProcessing(
    denoKv,
    status.value!.EnterpriseLookup,
    status.value!.ID,
    commitReq,
    handleEaCCommitRequest,
  );

  const existingEaC = await denoKv.get<EverythingAsCode>([
    "EaC",
    EnterpriseLookup,
  ]);

  const saveEaC: EverythingAsCode = existingEaC?.value! || {
    EnterpriseLookup,
    ParentEnterpriseLookup,
  };

  const diffKeys = Object.keys(eacDiff);

  if (Details) {
    saveEaC.Details = Details;
  }

  const errors: EaCHandlerErrorResponse[] = [];

  for (const key of diffKeys) {
    const diff = eacDiff[key];

    if (diff) {
      if (
        !Array.isArray(diff) &&
        typeof diff === "object" &&
        diff !== null &&
        diff !== undefined
      ) {
        const handled = await callEaCHandler(
          commitReq.JWT,
          key,
          saveEaC,
          diff as EaCMetadataBase,
        );

        for (const check of handled.Checks) {
          //  TODO: Process deployments until all complete, calling handler checks
        }

        saveEaC[key] = handled.Result;

        errors.push(...handled.Errors);
      } else if (diff !== undefined) {
        saveEaC[key] = diff;
      }
    }
  }

  if (errors.length === 0) {
    status.value!.Processing = EaCStatusProcessingTypes.COMPLETE;
  } else {
    status.value!.Processing = EaCStatusProcessingTypes.ERROR;

    for (const error of errors) {
      status.value!.Messages[error.Lookup] = error.Message;
    }
  }

  status.value!.EndTime = new Date();

  await listenQueueAtomic(denoKv, commitReq, (op) => {
    op = markEaCProcessed(EnterpriseLookup, op)
      .check(existingEaC)
      .check(status)
      .set(["EaC", EnterpriseLookup], saveEaC)
      .set(["EaC", "Status", "ID", commitReq.CommitID], status.value);

    if (commitReq.Username) {
      const userEaCRecord: UserEaCRecord = {
        EnterpriseLookup: EnterpriseLookup,
        EnterpriseName: saveEaC.Details!.Name!,
        Owner: true,
        Username: commitReq.Username,
      };

      op = op
        .set(
          ["User", commitReq.Username, "EaC", EnterpriseLookup],
          userEaCRecord,
        )
        .set(
          ["EaC", "Users", EnterpriseLookup, commitReq.Username],
          userEaCRecord,
        );
    }

    return op;
  });
}

export type EaCHandlers = {
  [key: string]: {
    APIPath: string;
  };
};

export async function callEaCHandler<T extends EaCMetadataBase>(
  jwt: string,
  key: string,
  currentEaC: EverythingAsCode,
  diff: T,
): Promise<{
  Checks: EaCHandlerCheckRequest[];

  Errors: EaCHandlerErrorResponse[];

  Result: T;
}> {
  const handlers: EaCHandlers = {
    Clouds: {
      APIPath: "http://localhost:5437/api/handlers/clouds",
    },
  };

  const handler = handlers[key];

  const toExecute = Object.keys(diff || {}).map(async (diffLookup) => {
    const result = await fetch(handler.APIPath, {
      method: "post",
      body: JSON.stringify({
        EaC: currentEaC,
        Lookup: diffLookup,
        Model: diff![diffLookup],
      } as EaCHandlerRequest),
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return (await result.json()) as
      | EaCHandlerResponse
      | EaCHandlerErrorResponse;
  });

  const handledResponses: (EaCHandlerResponse | EaCHandlerErrorResponse)[] =
    await Promise.all(toExecute);

  const current = (currentEaC[key] || {}) as T;

  const errors: EaCHandlerErrorResponse[] = [];

  const checks: EaCHandlerCheckRequest[] = [];

  if (current) {
    for (const handledResponse of handledResponses) {
      if (isEaCHandlerResponse(handledResponse)) {
        current[handledResponse.Lookup] = handledResponse.Model;

        checks.push(...(handledResponse.Checks || []));
      } else if (isEaCHandlerErrorResponse(handledResponse)) {
        errors.push(handledResponse);
      }
    }
  }

  return {
    Checks: checks,
    Result: current,
    Errors: errors,
  };
}
