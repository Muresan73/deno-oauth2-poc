import { create, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const KEY = await crypto.subtle.generateKey(
  {
    name: "RSASSA-PKCS1-v1_5",
    modulusLength: 1024,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
  },
  true,
  ["sign", "verify"],
);
export type JWTSession = {
  user: string;
  refresh_token?: string;
  access_token: string;
  expires_at?: number;
};

export async function createJWTsesstion(data: JWTSession) {
  return await create({ alg: "RS256", typ: "JWT" }, data, KEY.privateKey);
}

export async function verifyJWTsession(jwt: string): Promise<JWTSession> {
  console.log("happy");

  return await verify(jwt, KEY.publicKey);
}
