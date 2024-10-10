import { Handlers } from "$fresh/server.ts";
import { client, deleteVerifier, getVerifier } from "@/utils/oauth.ts";
import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";
import { createJWTsesstion } from "@/utils/jwt.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    // Make sure the codeVerifier is present for the user's session

    const headers = new Headers();
    const codeVerifier = getVerifier(req);
    deleteVerifier(headers);

    if (typeof codeVerifier !== "string") {
      throw new Error("invalid codeVerifier");
    }

    try {
      const tokens = await client.code.getToken(req.url, {
        codeVerifier,
      });

      const userInfo = await getUserEmailFromAzure(tokens.accessToken);
      // This is necessary because the generated token is too long
      // the added code neeed to be compressed
      console.log("azure response ", userInfo);

      const accessJWT = await createJWTsesstion({
        token: tokens.accessToken,
      });
      const refreshJWT =
        tokens.refreshToken &&
        (await createJWTsesstion({
          token: tokens.refreshToken,
        }));
      //
      // if (sessionToken.length > 4096)
      //   throw new Error("Token too long: " + sessionToken.length);
      //

      setCookie(headers, {
        name: "token",
        value: accessJWT,
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        path: "/",
        maxAge: 3600, // 1 hour
      });
      setCookie(headers, {
        name: "rf_token",
        value: refreshJWT || "",
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        path: "/",
        maxAge: 3600, // 1 hour
      });

      headers.set("Location", "/greeting");
      return new Response(null, {
        status: 302,
        headers,
      });
    } catch (error) {
      console.error("Error:", error);
      return new Response("Authentication failed", { status: 401 });
    }
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
