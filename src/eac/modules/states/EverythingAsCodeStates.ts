import { EaCMetadataBase } from "../../EaCMetadataBase.ts";
import { EaCStateEntityAsCode } from "./EaCStateEntityAsCode.ts";
import { EaCStateAsCode } from "./EaCStateAsCode.ts";
import { EaCDistributedFileSystem } from "../applications/EaCDistributedFileSystem.ts";

export type EverythingAsCodeStates = {
  DFS?: Record<string, EaCDistributedFileSystem>;

  StateEntities?: Record<string, EaCStateEntityAsCode>;

  States?: Record<string, EaCStateAsCode>;
} & EaCMetadataBase;

export function isEverythingAsCodeStates(
  eac: unknown,
): eac is EverythingAsCodeStates {
  const statesEaC = eac as EverythingAsCodeStates;

  return (
    statesEaC.StateEntities !== undefined && statesEaC.States !== undefined
  );
}
