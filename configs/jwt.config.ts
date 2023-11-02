import { create, decode, getNumericDate, verify } from "@djwt";

export const jwtConfig = {
  Algorithm: { name: "HMAC", hash: "SHA-512" } as AlgorithmIdentifier,
  async Create(data: Record<string, unknown>) {
    const jwt = await create(
      { alg: "HS512", typ: "JWT" },
      { exp: getNumericDate(this.ExpirationTime), ...data },
      await this.SecretKey(),
    );

    return jwt;
  },
  async Decode(token: string) {
    const decoded = await decode(token);

    return decoded;
  },
  ExpirationTime: 1, //60 * 60, // 60 minutes
  Header: "Authorization",
  JWK: JSON.parse(Deno.env.get("SECURE_API_SECRET") || "") as JsonWebKey,
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

export async function generateKeyValue(): Promise<JsonWebKey> {
  const key = await crypto.subtle.generateKey(
    jwtConfig.Algorithm,
    true,
    jwtConfig.KeyUsages,
  );

  return await crypto.subtle.exportKey("jwk", key);
}
