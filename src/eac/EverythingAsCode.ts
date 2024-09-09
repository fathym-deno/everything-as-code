import { EaCModuleHandlers } from "./EaCModuleHandlers.ts";
import { EaCDetails } from "./EaCDetails.ts";
import { EaCEnterpriseDetails } from "./EaCEnterpriseDetails.ts";
import { $FluentTag } from "../fluent/.deps.ts";

/**
 * Everything as Code (EaC) graph.
 */
export type EverythingAsCode = {
  /** The Details for the EaC node. */
  Details?: EaCEnterpriseDetails;

  /** The enterprise lookup for the EaC. */
  EnterpriseLookup?: string;

  /** The module handlers for the EaC. */
  Handlers?: EaCModuleHandlers;

  /** The parent enterprise lookup for the EaC. */
  ParentEnterpriseLookup?: string;
};

/**
 * EaC Diff represents the difference between two versions of the Everything as Code graph, omitting the enterprise lookup, parent enterprise lookup and details.
 */
export type EaCDiff = Omit<
  EverythingAsCode,
  "EnterpriseLookup" | "ParentEnterpriseLookup" | "Details"
>;

//   AccessRights?: { [key: string]: EaCAccessRightAsCode };
//   Hosts?: { [key: string]: EaCHostAsCode };
//   PrimaryHost?: string;
