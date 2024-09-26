import { Handlers } from "$fresh/server.ts";
import { client, setVerifier } from "@utils/oauth.ts";

import { Cookie, getCookies, setCookie } from "$std/http/cookie.ts";
import { assertEquals, assertStringIncludes } from "$std/assert/mod.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const { uri, codeVerifier } = await client.code.getAuthorizationUri();
    // client.refreshToken.refresh();
    // Store both the state and codeVerifier in the user session

    const cookies = getCookies(req.headers);
    console.log(cookies);
    const headers = setVerifier(codeVerifier);
    headers.set("Location", uri.toString());

    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
