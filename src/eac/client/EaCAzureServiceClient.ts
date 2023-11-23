import { Location } from "npm:@azure/arm-subscriptions";
import { EaCBaseClient } from "./EaCBaseClient.ts";
import { EaCServiceDefinitions } from "../../api/models/EaCServiceDefinitions.ts";

export class EaCAzureServiceClient extends EaCBaseClient {
  /** */
  constructor(protected baseUrl: URL, protected apiToken: string) {
    super(baseUrl, apiToken);
  }

  //#region API Methods
  public async CloudLocations(
    entLookup: string,
    cloudLookup: string,
    svcDefs: EaCServiceDefinitions,
  ): Promise<{
    Locations: Location[];
  }> {
    const response = await fetch(
      this.loadClientUrl(`${entLookup}/azure/${cloudLookup}/locations`),
      {
        method: "POST",
        headers: this.loadHeaders(),
        body: JSON.stringify(svcDefs),
      },
    );

    return await response.json();
  }
  //#endregion

  //#region Helpers
  //#endregion
}