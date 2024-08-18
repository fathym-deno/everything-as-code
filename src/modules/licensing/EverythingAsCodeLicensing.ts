import { EaCMetadataBase } from "../../eac/EaCMetadataBase.ts";
import { EaCLicenseAsCode } from "./EaCLicenseAsCode.ts";

export type EverythingAsCodeLicensing = {
  Licenses?: Record<string, EaCLicenseAsCode>;
} & EaCMetadataBase;

export function isEverythingAsCodeLicensing(
  eac: unknown,
): eac is EverythingAsCodeLicensing {
  const licEaC = eac as EverythingAsCodeLicensing;

  return licEaC.Licenses !== undefined;
}
