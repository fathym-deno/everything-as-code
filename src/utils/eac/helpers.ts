import { merge } from "@fathym/common";
import { EaCHandlers } from "../../api/EaCHandlers.ts";
import { EaCHandlerCheckRequest } from "../../api/models/EaCHandlerCheckRequest.ts";
import { EaCHandlerCheckResponse } from "../../api/models/EaCHandlerCheckResponse.ts";
import {
  EaCHandlerErrorResponse,
  isEaCHandlerErrorResponse,
} from "../../api/models/EaCHandlerErrorResponse.ts";
import { EaCHandlerRequest } from "../../api/models/EaCHandlerRequest.ts";
import {
  EaCHandlerResponse,
  isEaCHandlerResponse,
} from "../../api/models/EaCHandlerResponse.ts";
import { EaCStatus } from "../../api/models/EaCStatus.ts";
import { EaCStatusProcessingTypes } from "../../api/models/EaCStatusProcessingTypes.ts";
import { EaCMetadataBase } from "../../eac/EaCMetadataBase.ts";
import { EverythingAsCode } from "../../eac/EverythingAsCode.ts";
import { hasKvEntry, waitOnProcessing } from "../deno-kv/helpers.ts";

export async function callEaCHandler<T extends EaCMetadataBase>(
  handlers: EaCHandlers,
  jwt: string,
  key: string,
  currentEaC: EverythingAsCode,
  diff: T,
): Promise<{
  Checks: EaCHandlerCheckRequest[];

  Errors: EaCHandlerErrorResponse[];

  Result: T;
}> {
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

        handledResponse.Checks?.forEach((check) => {
          check.EaC = currentEaC;

          check.Type = key;
        });

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

export async function callEaCHandlerCheck(
  handlers: EaCHandlers,
  jwt: string,
  check: EaCHandlerCheckRequest,
): Promise<EaCHandlerCheckResponse> {
  const handler = handlers[check.Type!];

  const result = await fetch(`${handler.APIPath}/check`, {
    method: "post",
    body: JSON.stringify(check),
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const checkResp = (await result.json()) as EaCHandlerCheckResponse;

  return checkResp;
}

export async function eacExists(
  denoKv: Deno.Kv,
  entLookup: string,
): Promise<boolean> {
  let exists = await hasKvEntry(denoKv, ["EaC", entLookup]);

  if (!exists) {
    exists = await hasKvEntry(denoKv, ["EaC", "Archive", entLookup]);
  }

  if (!exists) {
    exists = await hasKvEntry(denoKv, ["EaC", "Processing", entLookup]);
  }

  return exists;
}

export async function invalidateProcessing(
  denoKv: Deno.Kv,
  entLookup: string,
  maxRunTimeSeconds = 60,
): Promise<void> {
  const status = await denoKv.get<EaCStatus>([
    "EaC",
    "Status",
    "Eac",
    entLookup,
  ]);

  if (status?.value) {
    const now = new Date(Date.now());

    const maxRunTime = new Date(
      status.value.StartTime.getSeconds() + maxRunTimeSeconds,
    );

    if (maxRunTime.getTime() < now.getTime()) {
      status.value.Processing = EaCStatusProcessingTypes.ERROR;

      status.value!.Messages = merge(status.value!.Messages, {
        Error: "Invalidated",
      });

      status.value.EndTime = new Date(Date.now());

      await markEaCProcessed(entLookup, denoKv.atomic())
        .set(["EaC", "Status", "ID", status.value.ID], status)
        .commit();
    }
  } else {
    await markEaCProcessed(entLookup, denoKv.atomic())
      .commit();
  }
}

export function markEaCProcessed(
  entLookup: string,
  atomicOp: Deno.AtomicOperation,
): Deno.AtomicOperation {
  return atomicOp
    .delete(["EaC", "Processing", entLookup])
    .delete(["EaC", "Status", "Eac", entLookup]);
}

export async function waitOnEaCProcessing<T>(
  denoKv: Deno.Kv,
  entLookup: string,
  commitId: string,
  msg: T,
  handler: (msg: T) => Promise<void>,
  maxRunTimeSeconds: number,
  sleepFor = 250,
): Promise<void> {
  await invalidateProcessing(denoKv, entLookup, maxRunTimeSeconds);

  const key = ["EaC", "Processing", entLookup];

  await waitOnProcessing(denoKv, key, msg, commitId, handler, sleepFor);
}
