import { EaCMetadataBase } from "../../EaCMetadataBase.ts";
import { EaCProviderAsCode } from "./EaCProviderAsCode.ts";

/**
 * The Identity spec used for tracking authentication and authorization configurations.
 */
export type EverythingAsCodeIdentity = {
  Providers?: Record<string, EaCProviderAsCode>;
} & EaCMetadataBase;

export function isEverythingAsCodeIdentity(
  eac: unknown,
): eac is EverythingAsCodeIdentity {
  const idEaC = eac as EverythingAsCodeIdentity;

  return idEaC.Databases !== undefined;
}
