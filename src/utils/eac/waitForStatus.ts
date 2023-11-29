import { EaCStatus } from "../../api/models/EaCStatus.ts";
import { EaCStatusProcessingTypes } from "../../api/models/EaCStatusProcessingTypes.ts";
import { EaCServiceClient } from "../../eac/client/EaCServiceClient.ts";
import { sleep } from "../sleep.ts";

export async function waitForStatus(
  eacSvc: EaCServiceClient,
  entLookup: string,
  commitId: string,
  sleepFor = 400,
): Promise<EaCStatus> {
  let status: EaCStatus | null = null;

  do {
    status = await eacSvc.Status(entLookup, commitId);

    await sleep(sleepFor);
  } while (
    status?.Processing != EaCStatusProcessingTypes.COMPLETE &&
    status?.Processing != EaCStatusProcessingTypes.ERROR
  );

  return status;
}
