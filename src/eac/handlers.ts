import { isEaCCommitCheckRequest } from "../api/models/EaCCommitCheckRequest.ts";
import { handleEaCCommitCheckRequest } from "../../handlers/eac/commit-check.handler.ts";
import { denoKv } from "../../configs/deno-kv.config.ts";
import { isEaCCommitRequest } from "../api/models/EaCCommitRequest.ts";
import { handleEaCCommitRequest } from "../../handlers/eac/commit.handler.ts";
import { isEaCDeleteRequest } from "../api/models/EaCDeleteRequest.ts";
import { handleEaCDeleteRequest } from "../../handlers/eac/delete.handler.ts";

/**
 * This listener set is responsible for the core EaC actions.
 */
denoKv.listenQueue(async (msg: unknown) => {
  console.log(`Picked up queue message:`);
  console.log(msg);

  if (isEaCCommitCheckRequest(msg)) {
    await handleEaCCommitCheckRequest(msg);
  } else if (isEaCDeleteRequest(msg)) {
    await handleEaCDeleteRequest(msg);
  } else if (isEaCCommitRequest(msg)) {
    await handleEaCCommitRequest(msg);
  }
});
