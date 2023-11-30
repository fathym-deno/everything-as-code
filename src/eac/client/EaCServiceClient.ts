import { EverythingAsCode } from "../../eac/EverythingAsCode.ts";
import { UserEaCRecord } from "../../api/UserEaCRecord.ts";
import { EaCCommitResponse } from "../../api/models/EaCCommitResponse.ts";
import { EaCStatus } from "../../api/models/EaCStatus.ts";
import { EaCBaseClient } from "./EaCBaseClient.ts";

export class EaCServiceClient extends EaCBaseClient {
  /** */
  constructor(protected baseUrl: URL, protected apiToken: string) {
    super(baseUrl, apiToken);
  }

  //#region API Methods
  public async Commit<T extends EverythingAsCode>(
    eac: T,
    processingSeconds: number,
  ): Promise<EaCCommitResponse> {
    const response = await fetch(
      this.loadClientUrl(
        `${eac.EnterpriseLookup}?processingSeconds=${processingSeconds}`,
      ),
      {
        method: "POST",
        headers: this.loadHeaders(),
        body: JSON.stringify(eac),
      },
    );

    return await response.json();
  }

  public async Create<T extends EverythingAsCode>(
    eac: T,
    processingSeconds: number,
  ): Promise<EaCCommitResponse> {
    const response = await fetch(
      this.loadClientUrl(`?processingSeconds=${processingSeconds}`),
      {
        method: "POST",
        headers: this.loadHeaders(),
        body: JSON.stringify(eac),
      },
    );

    return await response.json();
  }

  public async CurrentStatus(entLookup: string): Promise<EaCStatus> {
    const response = await fetch(
      this.loadClientUrl(`${entLookup}/status/current`),
      {
        headers: this.loadHeaders(),
      },
    );

    return await response.json();
  }

  public async Delete(
    entLookup: string,
    processingSeconds: number,
  ): Promise<EaCCommitResponse> {
    const response = await fetch(
      this.loadClientUrl(`${entLookup}?processingSeconds=${processingSeconds}`),
      {
        method: "DELETE",
        headers: this.loadHeaders(),
      },
    );

    return await response.json();
  }

  public async Get<T extends EverythingAsCode>(entLookup: string): Promise<T> {
    const response = await fetch(this.loadClientUrl(`${entLookup}`), {
      headers: this.loadHeaders(),
    });

    return await response.json();
  }

  public async InviteUser(
    entLookup: string,
    userEaC: UserEaCRecord,
  ): Promise<EaCCommitResponse> {
    const response = await fetch(this.loadClientUrl(`${entLookup}/user`), {
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

  public async ListStati(
    entLookup: string,
  ): Promise<EaCStatus[]> {
    const response = await fetch(
      this.loadClientUrl(`${entLookup}/status`),
      {
        headers: this.loadHeaders(),
      },
    );

    return await response.json();
  }

  public async ListUsers(entLookup: string): Promise<UserEaCRecord[]> {
    const response = await fetch(this.loadClientUrl(`${entLookup}/users`), {
      headers: this.loadHeaders(),
    });

    return await response.json();
  }

  public async Status(entLookup: string, commitId: string): Promise<EaCStatus> {
    const response = await fetch(
      this.loadClientUrl(`${entLookup}/status/${commitId}`),
      {
        headers: this.loadHeaders(),
      },
    );

    return await response.json();
  }
  //#endregion

  //#region Helpers
  //#endregion
}
