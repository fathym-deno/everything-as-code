import { EaCMetadataBase } from "../../EaCMetadataBase.ts";
import { EaCApplicationAsCode } from "./EaCApplicationAsCode.ts";
import { EaCDistributedFileSystem } from "./EaCDistributedFileSystem.ts";
import { EaCModifierAsCode } from "./EaCModifierAsCode.ts";
import { EaCProjectAsCode } from "./EaCProjectAsCode.ts";

export type EverythingAsCodeApplications = {
  Applications?: Record<string, EaCApplicationAsCode>;

  DFS?: Record<string, EaCDistributedFileSystem>;

  Modifiers?: Record<string, EaCModifierAsCode>;

  Projects?: Record<string, EaCProjectAsCode>;
} & EaCMetadataBase;

export function isEverythingAsCodeApplications(
  eac: unknown,
): eac is EverythingAsCodeApplications {
  const sourcesEaC = eac as EverythingAsCodeApplications;

  return (
    sourcesEaC.Applications !== undefined &&
    sourcesEaC.Projects !== undefined
  );
}
