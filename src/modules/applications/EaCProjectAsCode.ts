import { EaCDetails } from "../../eac/EaCDetails.ts";
import { EaCProjectDetails, isEaCProjectDetails } from "./EaCProjectDetails.ts";
import { EaCApplicationResolverConfiguration } from "./EaCApplicationResolverConfiguration.ts";
import { EaCProjectResolverConfiguration } from "./EaCProjectResolverConfiguration.ts";
import { EaCModifierResolverConfiguration } from "./EaCModifierResolverConfiguration.ts";

export type EaCProjectAsCode = {
  ApplicationResolvers: Record<string, EaCApplicationResolverConfiguration>;

  ModifierResolvers?: Record<string, EaCModifierResolverConfiguration>;

  ResolverConfigs: Record<string, EaCProjectResolverConfiguration>;
} & EaCDetails<EaCProjectDetails>;

export function isEaCProjectAsCode(eac: unknown): eac is EaCProjectAsCode {
  const proj = eac as EaCProjectAsCode;

  return (
    proj &&
    proj.Details !== undefined &&
    isEaCProjectDetails(proj.Details) &&
    proj.ApplicationResolvers !== undefined &&
    proj.ResolverConfigs !== undefined
  );
}
