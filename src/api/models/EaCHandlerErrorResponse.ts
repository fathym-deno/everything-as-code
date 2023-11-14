export type EaCHandlerErrorResponse = {
  HasError: true;

  Lookup: string;

  Message: string;
};

export function isEaCHandlerErrorResponse(
  res: unknown,
): res is EaCHandlerErrorResponse {
  const errorResponse = res as EaCHandlerErrorResponse;

  return (
    errorResponse.HasError !== undefined &&
    errorResponse.HasError &&
    typeof errorResponse.HasError === "boolean" &&
    errorResponse.Lookup !== undefined &&
    typeof errorResponse.Lookup === "string" &&
    errorResponse.Message !== undefined &&
    typeof errorResponse.Message === "string"
  );
}
