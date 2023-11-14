export type EaCHandlerCheckResponse = {
  Complete: boolean;

  HasError: boolean;
  
  Message: string;
};

export function isEaCHandlerCheckResponse(res: unknown): res is EaCHandlerCheckResponse {
  const checkResponse = res as EaCHandlerCheckResponse;

  return (
    checkResponse.Complete !== undefined &&
    typeof checkResponse.Complete === "boolean" &&
    checkResponse.HasError !== undefined &&
    typeof checkResponse.HasError === "boolean" &&
    checkResponse.Message !== undefined &&
    typeof checkResponse.Message === "string"
  );
}
