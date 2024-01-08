import { EaCMetadataBase } from "../../EaCMetadataBase.ts";

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
