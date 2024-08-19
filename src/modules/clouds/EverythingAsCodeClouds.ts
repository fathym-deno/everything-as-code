import { EaCMetadataBase } from "../../eac/EaCMetadataBase.ts";
import { EaCCloudAsCode } from "./EaCCloudAsCode.ts";
import { EaCSecretAsCode } from "./EaCSecretAsCode.ts";

export type EverythingAsCodeClouds = {
  Clouds?: Record<string, EaCCloudAsCode>;

  Secrets?: Record<string, EaCSecretAsCode>;
} & EaCMetadataBase;

export function isEverythingAsCodeClouds(
  eac: unknown,
): eac is EverythingAsCodeClouds {
  const iotEaC = eac as EverythingAsCodeClouds;

  return iotEaC.Clouds !== undefined;
}
