import { EaCDetails } from "../../EaCDetails.ts";
import { EaCEnvironmentDetails } from "./EaCEnvironmentDetails.ts";
import { EaCCloudAsCode } from "./cloud/EaCCloudAsCode.ts";

export type EaCEnvironmentAsCode = EaCDetails<EaCEnvironmentDetails> & {
  Clouds?: { [key: string]: EaCCloudAsCode } | null;
};

// Artifacts?: { [key: string]: EaCArtifactAsCode } | null;
// DevOpsActions?: { [key: string]: EaCDevOpsActionAsCode } | null;
// Secrets?: { [key: string]: EaCSecretAsCode } | null;
// Sources?: { [key: string]: EaCSourceControlAsCode } | null;
// IoT?: { [key: string]: EaCIoTAsCode } | null;
