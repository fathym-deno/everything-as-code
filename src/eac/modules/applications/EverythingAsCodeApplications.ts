import { EverythingAsCodeDFS } from "../dfs/EverythingAsCodeDFS.ts";
import { EaCApplicationAsCode } from "./EaCApplicationAsCode.ts";
import { EaCModifierAsCode } from "./EaCModifierAsCode.ts";
import { EaCProjectAsCode } from "./EaCProjectAsCode.ts";

export type EverythingAsCodeApplications = {
  Applications?: Record<string, EaCApplicationAsCode | null>;

  Modifiers?: Record<string, EaCModifierAsCode | null>;

  Projects?: Record<string, EaCProjectAsCode | null>;
} & EverythingAsCodeDFS;

export function isEverythingAsCodeApplications(
  eac: unknown,
): eac is EverythingAsCodeApplications {
  const sourcesEaC = eac as EverythingAsCodeApplications;

  return (
    sourcesEaC.Applications !== undefined && sourcesEaC.Projects !== undefined
  );
}
