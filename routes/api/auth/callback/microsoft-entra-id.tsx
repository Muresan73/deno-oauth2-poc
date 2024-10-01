import { Handlers } from "$fresh/server.ts";
import { client, getVerifier } from "@utils/oauth.ts";
import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";
import { createJWTsesstion } from "@utils/jwt.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    // Make sure the codeVerifier is present for the user's session

    const headers = new Headers();
    const codeVerifier = getVerifier(req, headers);

    if (typeof codeVerifier !== "string") {
      throw new Error("invalid codeVerifier");
    }
    let tokens = null;
    try {
      tokens = await client.code.getToken(req.url, {
        codeVerifier,
      });
    } catch (_error) {
      throw new Error("Unable to get tokens");
    }

    const userInfo = await getUserEmailFromAzure(tokens.accessToken);
    // This is necessary because the generated token is too long
    // the added code neeed to be compressed
    const refreshToken = tokens.refreshToken;
    console.log("azure response ", userInfo);

    const sessionToken = await createJWTsesstion({
      refresh_token: refreshToken,
      access_token: tokens.accessToken,
    } as any);

    if (sessionToken.length > 4096)
      throw new Error("Token too long: " + sessionToken.length);

    // Set the JWT token as a cookie
    setCookie(headers, {
      name: "my.session",
      value: sessionToken,
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 3600, // 1 hour
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/greeting",
        "Set-Cookie": `token=${sessionToken}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Lax`,
      },
    });
  },
};

type UserInfoType = {
  businessPhones: [];
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
  id: string;
};

async function getUserEmailFromAzure(
  accessToken: string,
): Promise<UserInfoType | null> {
  const graphApiEndpoint = "https://graph.microsoft.com/v1.0/me";

  const resp = await fetch(graphApiEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const userData: UserInfoType = await resp.json();

  return userData;
}
