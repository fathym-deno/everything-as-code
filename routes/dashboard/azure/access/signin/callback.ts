import { decode } from "@djwt";
import { Handlers } from "$fresh/server.ts";
import { gitHubOAuth } from "../../../../../configs/oAuth.config.ts";
import { fathymDenoKv } from "../../../../../configs/deno-kv.config.ts";
import { UserOAuthConnection } from "../../../../../src/oauth/UserOAuthConnection.ts";

export const handler: Handlers = {
  async GET(req, _ctx) {
    const now = Date.now();

    const { response, tokens } = await gitHubOAuth.handleCallback(
      req,
    );

    const { accessToken, refreshToken, expiresIn } = tokens;

    const expiresAt = now + expiresIn * 1000;

    const [header, payload, signature] = await decode(accessToken);

    const primaryEmail = (payload as Record<string, string>).emails[0];

    await fathymDenoKv.set(
      ["User", "Current", "Azure", "AzureConnection"],
      {
        RefreshToken: refreshToken,
        Token: accessToken,
        Username: primaryEmail,
        ExpiresAt: expiresAt,
      } as UserOAuthConnection,
      {
        expireIn: expiresIn * 1000,
      },
    );

    return response;
  },
};
