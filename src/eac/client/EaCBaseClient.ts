export class EaCBaseClient {
  /** */
  constructor(protected baseUrl: URL, protected apiToken: string) {}

  //#region API Methods
  //#endregion

  //#region Helpers
  protected loadClientUrl(refPath: string | URL): string | URL {
    const clientUrl = new URL(refPath, this.baseUrl);

    return clientUrl;
  }

  protected loadHeaders(
    headers: HeadersInit | undefined = undefined,
  ): HeadersInit {
    return {
      Authorization: `Bearer ${this.apiToken}`,
      "Content-Type": "application/json",
      ...(headers || {}),
    };
  }
  //#endregion
}
