import { create, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const KEY = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);
export type JWTSession = {
  refresh_token?: string;
  access_token: string;
  expires_at?: number;
};

export async function createJWTsesstion(data: JWTSession) {
  return await create({ alg: "HS512", typ: "JWT" }, data, KEY);
}

export async function verifyJWTsession(jwt: string): Promise<JWTSession> {
  return await verify(jwt, KEY);
}
