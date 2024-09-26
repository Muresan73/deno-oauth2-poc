import {
  OAuth2Client,
  OAuth2ClientConfig,
} from "https://deno.land/x/oauth2_client@v1.0.2/mod.ts";
import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";
import { FreshContext } from "$fresh/server.ts";

const clientId = Deno.env.get("AUTH_MICROSOFT_ENTRA_ID_ID")!;
const clientSecret = Deno.env.get("AUTH_MICROSOFT_ENTRA_ID_SECRET");
const tenantId = Deno.env.get("AUTH_MICROSOFT_ENTRA_ID_TENANT_ID");
const redirectUri =
  "http://localhost:3000/api/auth/callback/microsoft-entra-id";

export const Oauth2Config: OAuth2ClientConfig = {
  clientId,
  clientSecret,
  authorizationEndpointUri: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
  tokenUri: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
  redirectUri,
};

export const client = new OAuth2Client({
  clientId,
  clientSecret,
  authorizationEndpointUri: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
  tokenUri: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
  redirectUri,
  defaults: {
    scope: "openid profile email Mail.Read User.Read offline_access",
  },
});

const COOKIE_NAME = "codeVerifier";

export function setVerifier(codeVerifier: string) {
  const headers = new Headers();
  setCookie(headers, {
    name: COOKIE_NAME,
    value: codeVerifier,
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 3600, // 1 hour
  });

  return headers;
}

export function getVerifier(req: Request, headers: Headers) {
  const codeVerifier = getCookies(req.headers)[COOKIE_NAME];
  // deleteCookie(headers, COOKIE_NAME);
  return codeVerifier;
}

export async function getRefreshToken(ctx: FreshContext) {
  const refreshToken = ctx.data.token.refresh;
  const tokens = await client.refreshToken.refresh(refreshToken);
  ctx.data.token.access = tokens.accessToken;
  ctx.data.token.refresh = tokens.refreshToken;
}
