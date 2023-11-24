import { IotHubClient } from "npm:@azure/arm-iothub";
import { Registry as IoTRegistry } from "npm:azure-iothub";
import { EaCDeviceAsCode } from "../../../../src/eac/modules/iot/EaCDeviceAsCode.ts";
import { EaCCloudAsCode } from "../../../../src/eac/modules/clouds/EaCCloudAsCode.ts";
import { loadAzureCloudCredentials } from "../../../../src/utils/eac/loadAzureCloudCredentials.ts";
import { EaCCloudAzureDetails } from "../../../../src/eac/modules/clouds/EaCCloudAzureDetails.ts";
import { DeviceCodeCredential } from "npm:@azure/identity";
import { EaCDeviceDetails } from "../../../../src/eac/modules/iot/EaCDeviceDetails.ts";
import { EnsureIoTDevicesResponse } from "../../../../src/eac/modules/iot/models/EnsureIoTDevicesResponse.ts";
import { EaCIoTAsCode } from "../../../../src/eac/modules/iot/EaCIoTAsCode.ts";

export async function ensureIoTDevices(
  cloud: EaCCloudAsCode,
  iot: EaCIoTAsCode,
): Promise<EnsureIoTDevicesResponse> {
  const details = cloud.Details as EaCCloudAzureDetails;

  const iotClient = new IotHubClient(
    loadAzureCloudCredentials(cloud),
    details.SubscriptionID,
  );

  const resGroupName = iot.ResourceGroupLookup;

  const iotHubName = `${resGroupName}-iot-hub`;

  const keyName = "iothubowner";

  const keys = await iotClient.iotHubResource.getKeysForKeyName(
    resGroupName,
    iotHubName,
    keyName,
  );

  const iotHubConnStr =
    `HostName=${iotHubName}.azure-devices.net;SharedAccessKeyName=${keyName};SharedAccessKey=${keys.primaryKey}`;

  const iotRegistry = IoTRegistry.fromConnectionString(iotHubConnStr);

  const deviceLookups = Object.keys(iot.Devices || {});

  const deviceRequestCalls = deviceLookups.map(async (deviceLookup) => {
    const device = iot.Devices![deviceLookup];

    const deviceDetails: EaCDeviceDetails = device.Details!;

    try {
      await iotRegistry.get(deviceLookup);

      return null;
    } catch (err) {
      if (err.name !== "DeviceNotFoundError") {
        throw err;
      }
    }

    return {
      deviceId: deviceLookup,
      capabilities: {
        iotEdge: deviceDetails.IsIoTEdge,
      },
    };
  });

  const deviceRequests = await Promise.all(deviceRequestCalls);

  const addDevicesResp = await iotRegistry.addDevices(
    deviceRequests
      .filter((deviceReq) => deviceReq)
      .map((deviceReq) => deviceReq!),
  );

  return (addDevicesResp.responseBody.errors || []).reduce((result, error) => {
    result[error.deviceId] = {
      Error: error.errorCode.message,
      ErrorStatus: error.errorStatus,
    };

    return result;
  }, {} as EnsureIoTDevicesResponse);
}
