import { Handlers } from "$fresh/server.ts";
import { client, getVerifier } from "@utils/oauth.ts";
import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";
import { createJWTsesstion } from "@utils/jwt.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    // Make sure the codeVerifier is present for the user's session

    const headers = new Headers();

    const sessionToken = await createJWTsesstion({
      user: "Hablaty Ormester",
      buzi: "buzi",
      refresh_token: "ref1234",
      access_token: "acc1234",
      expires_at: 1111,
    } as any);

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
        Location: "data",
        "Set-Cookie": `token=${sessionToken}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Lax`,
      },
    });
  },
};
