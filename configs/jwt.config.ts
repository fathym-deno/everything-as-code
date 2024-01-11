import { create, decode, getNumericDate, verify } from "@djwt";
import { decodeBase64 } from "$std/encoding/base64.ts";
import { JWTConfig } from "../src/utils/jwt/JWTConfig.ts";

const jwkEnv = Deno.env.get("SECURE_API_SECRET")!;

console.log(jwkEnv);

const jwkDecode = new TextDecoder().decode(
  decodeBase64(jwkEnv),
);

console.log(jwkDecode);

const jwk = JSON.parse(jwkDecode || "") as JsonWebKey;

export const jwtConfig: JWTConfig = {
  Algorithm: { name: "HMAC", hash: "SHA-512" } as AlgorithmIdentifier,
  async Create(data: Record<string, unknown>, expTime?: number) {
    const jwt = await create(
      { alg: "HS512", typ: "JWT" },
      { exp: getNumericDate(expTime || this.ExpirationTime), ...data },
      await this.SecretKey(),
    );

    return jwt;
  },
  async Decode<T>(
    token: string,
  ): Promise<[header: unknown, payload: T, signature: Uint8Array]> {
    const [header, payload, signature] = await decode(token);

    return [header, payload as T, signature];
  },
  ExpirationTime: 60 * 60 * 24 * 365 * 5, // 5 years
  Header: "Authorization",
  JWK: jwk,
  KeyUsages: ["sign", "verify"] as KeyUsage[],
  LoadToken(req: Request) {
    const jwtHeader = req.headers.get(jwtConfig.Header);

    const jwtToken = jwtHeader?.replace(`${jwtConfig.Schema} `, "");

    return jwtToken;
  },
  async SecretKey() {
    return await crypto.subtle.importKey(
      "jwk",
      this.JWK,
      this.Algorithm,
      true,
      this.KeyUsages,
    );
  },
  Schema: "Bearer",
  Type: "JWT",
  async Verify(token: string) {
    const verified = await verify(token, await this.SecretKey());

    return verified;
  },
};
