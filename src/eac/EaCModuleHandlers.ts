import { EaCModuleHandler } from "./EaCModuleHandler.ts";

/**
 * The colleaction of EaC module handlers to use when processing an EaC.
 */
export type EaCModuleHandlers = {
  /**
   * When true the handlers will force a complete update. When false, the handlers will be merged with existing.
   */
  Force?: boolean;
} & Record<string, EaCModuleHandler | null>;
