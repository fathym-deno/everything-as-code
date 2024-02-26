import { EaCHandler } from "./EaCHandler.ts";

export type EaCHandlers = {
  Force?: boolean;
} & Record<string, EaCHandler | null>;
