import { EaCMetadataBase } from "../../EaCMetadataBase.ts";
import { EaCApplicationAsCode } from "./EaCApplicationAsCode.ts";
import { EaCProjectAsCode } from "./EaCProjectAsCode.ts";

export type EverythingAsCodeApplications = {
  Applications?: Record<string, EaCApplicationAsCode>;

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
