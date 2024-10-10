import * as jose from "https://deno.land/x/jose@v5.9.3/index.ts";

export type JWTSession = {
  token: string;
};

const { publicKey, privateKey } = await jose.generateKeyPair("RSA-OAEP-256");

export async function createJWTsesstion(data: JWTSession) {
  console.log("\n ==== Data", data);

  return await new jose.EncryptJWT(data)
    .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
    .setIssuedAt()
    .setIssuer("urn:despono:deno")
    .setAudience(["urn:despono:deno", "urn:desepono:dotnet"])
    .setExpirationTime("2h")
    .encrypt(publicKey);
}

export async function verifyJWTsession(jwt: string): Promise<JWTSession> {
  const { payload } = await jose.jwtDecrypt(jwt, privateKey, {
    issuer: "urn:despono:deno",
    audience: "urn:despono:deno",
  });

  return payload as JWTSession;
}

export async function createJWTsesstion2(data: JWTSession) {
  const secret = jose.base64url.decode(
    "zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI",
  );
  const jwt = await new jose.EncryptJWT(data)
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256", cty: "JWT" })
    .setIssuedAt()
    .setIssuer("urn:example:issuer")
    .setAudience("urn:example:audience")
    .setExpirationTime("2h")
    .encrypt(secret);

  return jwt;
}
