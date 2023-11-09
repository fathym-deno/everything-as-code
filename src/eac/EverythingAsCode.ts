import { EaCDetails } from "./EaCDetails.ts";
import { EaCEnterpriseDetails } from "./EaCEnterpriseDetails.ts";

export type EverythingAsCode = {
  EnterpriseLookup?: string;

  ParentEnterpriseLookup?: string;
} & EaCDetails<EaCEnterpriseDetails>;

export type EaCDiff = Omit<
  EverythingAsCode,
  "EnterpriseLookup" | "ParentEnterpriseLookup" | "Details"
>;

//   AccessRights?: { [key: string]: EaCAccessRightAsCode };
//   Applications?: { [key: string]: EaCApplicationAsCode };
//   DataTokens?: { [key: string]: EaCDataTokenAsCode };
//   Environments?: { [key: string]: EaCEnvironmentAsCode };
//   Hosts?: { [key: string]: EaCHostAsCode };
//   LicenseConfigurations?: { [key: string]: EaCLicenseConfigurationAsCode };
//   Modifiers?: { [key: string]: EaCDFSModifierAsCode };
//   PrimaryEnvironment?: string;
//   PrimaryHost?: string;
//   Projects?: { [key: string]: EaCProjectAsCode };
//   Providers?: { [key: string]: EaCProviderAsCode };
