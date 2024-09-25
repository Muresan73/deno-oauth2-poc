import { OAuth2Client } from "https://deno.land/x/oauth2_client/mod.ts";
import { getCookies } from "$std/http/cookie.ts";

const clientId = Deno.env.get("AUTH_MICROSOFT_ENTRA_ID_ID")!;
const clientSecret = Deno.env.get("AUTH_MICROSOFT_ENTRA_ID_SECRET");
const tenantId = Deno.env.get("AUTH_MICROSOFT_ENTRA_ID_TENANT_ID");
const redirectUri =
  "http://localhost:3000/api/auth/callback/microsoft-entra-id";

export const Oauth2Config = {
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
    scope: "openid profile email Mail.Read User.Read",
  },
});

const kv = await Deno.openKv();

export async function getAuthenticatedUser(req: Request) {
  const cookies = getCookies(req.headers);
  const sessionId = cookies.session;

  if (!sessionId) {
    return null;
  }

  const sessionData = await kv.get(["sessions", sessionId]);
  if (!sessionData.value) {
    return null;
  }

  const userEmail = (sessionData.value as { userEmail: string }).userEmail;
  const tokenData = await kv.get(["oauth_tokens", userEmail]);

  if (!tokenData.value) {
    return null;
  }

  return {
    email: userEmail,
    accessToken: (tokenData.value as { accessToken: string }).accessToken,
  };
}
