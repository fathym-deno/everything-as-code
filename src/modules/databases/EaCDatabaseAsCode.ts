import { EaCDetails } from "../../eac/EaCDetails.ts";
import {
  EaCDatabaseDetails,
  isEaCDatabaseDetails,
} from "./EaCDatabaseDetails.ts";

export type EaCDatabaseAsCode = {} & EaCDetails<EaCDatabaseDetails>;

export function isEaCDatabaseAsCode(eac: unknown): eac is EaCDatabaseAsCode {
  const db = eac as EaCDatabaseAsCode;

  return db && isEaCDatabaseDetails(undefined, db.Details);
}
