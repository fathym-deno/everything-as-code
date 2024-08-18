/**
 * EaC module handler for use in EaC processing.
 */
export type EaCModuleHandler = {
  /** API path for this module. */
  APIPath: string;

  /** Order for this module in processing. Modules are process in parallel when sharing an order. */
  Order: number;
};
