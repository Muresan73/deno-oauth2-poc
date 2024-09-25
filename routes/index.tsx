import { Handlers, PageProps } from "$fresh/server.ts";
import { OAuth2Client } from "https://deno.land/x/oauth2_client/mod.ts";

import { Session } from "https://deno.land/x/oak_sessions@v4.0.5/mod.ts";
import { client } from "@utils/oauth.ts";
import { Cookie, setCookie } from "$std/http/cookie.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, ctx) {
    const { uri, codeVerifier } = await client.code.getAuthorizationUri();
    // Store both the state and codeVerifier in the user session
    const cookie: Cookie = { name: "codeVerifier", value: codeVerifier };

    const headers = new Headers();
    setCookie(headers, cookie);

    kv.set(["cv"], codeVerifier);

    // Store both the state and codeVerifier in the user session

    return ctx.render({ uri });
  },
};

export default function Home({ data }: PageProps) {
  return (
    <div>
      <h1>Welcome to the Login Page</h1>
      <p>{JSON.stringify(data.uri)}</p>
      <a href={data.uri}>Login with Microsoft</a>
    </div>
  );
}
