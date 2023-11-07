import { EverythingAsCode } from "../../EverythingAsCode.ts";
import { UserEaCRecord } from "../../api/UserEaCRecord.ts";
import { EaCCommitResponse } from "../../api/models/EaCCommitResponse.ts";
import { EaCStatus } from "../../api/models/EaCStatus.ts";

export class EaCServiceClient {
  /** */
  constructor(protected baseUrl: URL, protected apiToken: string) {}

  //#region API Methods
  public async Commit<T extends EverythingAsCode>(
    eac: Omit<T, "EnterpriseLookup">,
  ): Promise<EaCCommitResponse> {
    const response = await fetch(
      this.loadClientUrl(`/${eac.EnterpriseLookup}`),
      {
        method: "POST",
        headers: this.loadHeaders(),
        body: JSON.stringify(eac),
      },
    );

    return await response.json();
  }

  public async Create<T extends EverythingAsCode>(
    eac: Omit<T, "EnterpriseLookup">,
  ): Promise<EaCCommitResponse> {
    const response = await fetch(this.loadClientUrl(""), {
      method: "POST",
      headers: this.loadHeaders(),
      body: JSON.stringify(eac),
    });

    return await response.json();
  }

  public async CurrentStatus(entLookup: string): Promise<EaCStatus> {
    const response = await fetch(
      this.loadClientUrl(`/${entLookup}/status/current`),
      {
        headers: this.loadHeaders(),
      },
    );

    return await response.json();
  }

  public async Delete(entLookup: string): Promise<EaCCommitResponse> {
    const response = await fetch(this.loadClientUrl(`/${entLookup}`), {
      method: "DELETE",
      headers: this.loadHeaders(),
    });

    return await response.json();
  }

  public async Get<T extends EverythingAsCode>(entLookup: string): Promise<T> {
    const response = await fetch(this.loadClientUrl(`/${entLookup}`), {
      headers: this.loadHeaders(),
    });

    return await response.json();
  }

  public async InviteUser(
    entLookup: string,
    userEaC: Omit<UserEaCRecord, "EnterpriseLookup">,
  ): Promise<EaCCommitResponse> {
    const response = await fetch(this.loadClientUrl(`/${entLookup}/user`), {
      method: "POST",
      headers: this.loadHeaders(),
      body: JSON.stringify(userEaC),
    });

    return await response.json();
  }

  public async ListForUser(): Promise<UserEaCRecord[]> {
    const response = await fetch(this.loadClientUrl(""), {
      headers: this.loadHeaders(),
    });

    return await response.json();
  }

  public async ListUsers(entLookup: string): Promise<UserEaCRecord[]> {
    const response = await fetch(this.loadClientUrl(`/${entLookup}/users`), {
      headers: this.loadHeaders(),
    });

    return await response.json();
  }

  public async Status(entLookup: string, commitId: string): Promise<EaCStatus> {
    const response = await fetch(
      this.loadClientUrl(`/${entLookup}/status/${commitId}`),
      {
        headers: this.loadHeaders(),
      },
    );

    return await response.json();
  }
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
