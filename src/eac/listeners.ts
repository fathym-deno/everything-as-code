import { denoKv } from "../../configs/deno-kv.config.ts";
import { isEaCDeleteRequest } from "../api/models/EaCDeleteRequest.ts";
import { isEaCCommitRequest } from "../api/models/EaCCommitRequest.ts";
import { handleEaCCommitRequest } from "../../handlers/eac/commit.handler.ts";
import { handleEaCDeleteRequest } from "../../handlers/eac/delete.handler.ts";

/**
 * This listener set is responsible for the core EaC actions.
 */
denoKv.listenQueue(async (msg: unknown) => {
  if (isEaCCommitRequest(msg)) {
    await handleEaCCommitRequest(msg);
  } else if (isEaCDeleteRequest(msg)) {
    await handleEaCDeleteRequest(msg);
  }
});
