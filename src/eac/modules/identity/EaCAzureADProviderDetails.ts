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
  const adPrvdrDetails = details as EaCAzureADProviderDetails;

  return (
    isEaCProviderDetails(adPrvdrDetails) &&
    adPrvdrDetails.TenantID !== undefined &&
    typeof adPrvdrDetails.TenantID === "string"
  );
}
