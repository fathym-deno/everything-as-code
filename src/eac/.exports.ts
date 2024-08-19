import { resolvePath } from "./.deps.ts";

/**
 * The core Everything as Code (EaC) types.
 * @module
 */
export * from "./AllAnyTypes.ts";
export * from "./EaCDetails.ts";
export * from "./EaCEnterpriseDetails.ts";
export * from "./EaCModuleHandler.ts";
export * from "./EaCModuleHandlers.ts";
export * from "./EaCMetadataBase.ts";
export * from "./EaCVertexDetails.ts";
export * from "./EverythingAsCode.ts";

export function loadFathymEaCMetaUrl(path: string): string {
  return resolvePath(path, import.meta.resolve);
}
