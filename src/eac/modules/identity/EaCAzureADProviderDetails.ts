import {
  EaCProviderDetails,
  isEaCProviderDetails,
} from "./EaCProviderDetails.ts";

export type EaCAzureADProviderDetails = {
  TenantID: string;
} & EaCProviderDetails;

export function isEaCAzureADProviderDetails(
  details: unknown,
): details is EaCAzureADProviderDetails {
  const prvdrDetails = details as EaCAzureADProviderDetails;

  return (
    isEaCProviderDetails(prvdrDetails) &&
    prvdrDetails.TenantID !== undefined &&
    typeof prvdrDetails.TenantID === "string"
  );
}
