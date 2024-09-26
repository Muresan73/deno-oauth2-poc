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

    console.log("\n Tokens \n");
    console.log(tokens);

    const userInfo = await getUserEmailFromAzure(tokens.accessToken);
    const refreshToken = tokens.refreshToken;

    const sessionToken = await createJWTsesstion({
      refresh_token: refreshToken,
      access_token: tokens.accessToken,
      expires_at: tokens.expiresIn,
    });

    setCookie(headers, {
      name: "my.session",
      value: sessionToken,
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 3600, // 1 hour
    });

    // headers.set("Location", "/greeting");
    console.log("jwt included", headers);

    ctx.state.user = userInfo;
    return new Response(null, {
      status: 303,
      headers,
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
