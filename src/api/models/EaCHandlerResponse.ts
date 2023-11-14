import { EaCMetadataBase } from "../../eac/EaCMetadataBase.ts";
import { EaCHandlerCheckRequest } from "./EaCHandlerCheckRequest.ts";

export type EaCHandlerResponse = {
  Checks: EaCHandlerCheckRequest[];

  Lookup: string;

  Message: string;

  Model: EaCMetadataBase;
};

export function isEaCHandlerResponse(res: unknown): res is EaCHandlerResponse {
  const handlerResponse = res as EaCHandlerResponse;

  return (
    handlerResponse.Checks !== undefined &&
    Array.isArray(handlerResponse.Checks) &&
    handlerResponse.Lookup !== undefined &&
    typeof handlerResponse.Lookup === "string" &&
    handlerResponse.Message !== undefined &&
    typeof handlerResponse.Message === "string" &&
    handlerResponse.Model !== undefined
  );
}
