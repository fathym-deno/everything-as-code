import { EaCMetadataBase } from "../../eac/EaCMetadataBase.ts";
import { EverythingAsCode } from "../../eac/EverythingAsCode.ts";

export type EaCHandlerCheckRequest =
  & {
    EaC: EverythingAsCode;
  }
  & EaCMetadataBase;
