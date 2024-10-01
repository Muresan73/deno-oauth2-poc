import * as jose from "https://deno.land/x/jose@v5.9.3/index.ts";

export type JWTSession = {
  user: string;
  refresh_token?: string;
  access_token: string;
  expires_at?: number;
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
  const { payload, protectedHeader } = await jose.jwtDecrypt(jwt, privateKey, {
    issuer: "urn:despono:deno",
    audience: "urn:despono:deno",
  });
  console.log(protectedHeader);
  console.log("pl ", payload);

  return payload as JWTSession;
}
