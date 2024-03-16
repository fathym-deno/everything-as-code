import {
  EaCProviderDetails,
  isEaCProviderDetails,
} from "./EaCProviderDetails.ts";

export type EaCGitHubAppProviderDetails = {
  AppID: string;

  ClientID: string;

  ClientSecret: string;

  PrivateKey: string;

  WebhooksSecret: string;
} & EaCProviderDetails;

export function isEaCGitHubAppProviderDetails(
  details: unknown,
): details is EaCGitHubAppProviderDetails {
  const adb2cPrvdrDetails = details as EaCGitHubAppProviderDetails;

  return (
    isEaCProviderDetails(adb2cPrvdrDetails) &&
    adb2cPrvdrDetails.AppID !== undefined &&
    typeof adb2cPrvdrDetails.AppID === "string" &&
    adb2cPrvdrDetails.ClientID !== undefined &&
    typeof adb2cPrvdrDetails.ClientID === "string" &&
    adb2cPrvdrDetails.ClientSecret !== undefined &&
    typeof adb2cPrvdrDetails.ClientSecret === "string" &&
    adb2cPrvdrDetails.PrivateKey !== undefined &&
    typeof adb2cPrvdrDetails.PrivateKey === "string" &&
    adb2cPrvdrDetails.WebhooksSecret !== undefined &&
    typeof adb2cPrvdrDetails.WebhooksSecret === "string"
  );
}
