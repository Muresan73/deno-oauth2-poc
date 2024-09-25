import { Handlers } from "$fresh/server.ts";
import { client } from "@utils/oauth.ts";
import { getCookies } from "$std/http/cookie.ts";

// Initialize the KV store
const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, ctx) {
    // Make sure the codeVerifier is present for the user's session

    const cookies = getCookies(req.headers);
    // const codeVerifier = cookies["codeVerifier"];
    const codeVerifierResp = await kv.get(["cv"]);
    const codeVerifier = codeVerifierResp.value;

    if (typeof codeVerifier !== "string") {
      throw new Error("invalid codeVerifier");
    }

    // Exchange the authorization code for an access token
    const tokens = await client.code.getToken(req.url, {
      codeVerifier,
    });
    console.log(tokens);

    const userInfo = await getUserEmailFromAzure(tokens.accessToken);
    console.log(userInfo);
    return new Response("Hello " + userInfo || "");

    return ctx.render({ userInfo });
  },
};

export default function Home({ userInfo }) {
  return (
    <div>
      <h1>Hello</h1>
      <p>{JSON.stringify(userInfo)}</p>
      <a href="/">Go Home</a>
    </div>
  );
}

async function getUserEmailFromAzure(
  accessToken: string,
): Promise<string | null> {
  const graphApiEndpoint = "https://graph.microsoft.com/v1.0/me";
  console.log(accessToken);

  const resp = await fetch(graphApiEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log("should be fine now ");

  const userData = await resp.json();
  console.log(userData);

  return userData.displayName;
}
//
// export const handler: Handlers = {
//   async GET(req) {
//     try {
//       // Exchange the authorization code for tokens
//       const tokens = await client.code.getToken(req.url);
//
//       // Fetch user info to get the email
//       const userInfoResponse = await fetch(
//         "https://graph.microsoft.com/v1.0/me",
//         {
//           headers: {
//             Authorization: `Bearer ${tokens.accessToken}`,
//           },
//         },
//       );
//       const userInfo = await userInfoResponse.json();
//       const userEmail = userInfo.mail || userInfo.userPrincipalName;
//
//       if (!userEmail) {
//         throw new Error("Unable to retrieve user email");
//       }
//
//       // Store the tokens in KV, using the email as the key
//       await kv.set(["oauth_tokens", userEmail], {
//         accessToken: tokens.accessToken,
//         refreshToken: tokens.refreshToken,
//         expiresAt: tokens.expiresAt?.getTime(),
//       });
//
//       // Set a session cookie
//       const sessionId = crypto.randomUUID();
//       await kv.set(["sessions", sessionId], { userEmail });
//
//       const headers = new Headers();
//       setCookie(headers, {
//         name: "session",
//         value: sessionId,
//         path: "/",
//         httpOnly: true,
//         secure: true, // Set to true if using HTTPS
//         sameSite: "Lax",
//         maxAge: 60 * 60 * 24 * 7, // 1 week
//       });
//
//       // Redirect to the home page or a protected route
//       headers.set("Location", "/");
//       return new Response(null, {
//         status: 302,
//         headers,
//       });
//     } catch (error) {
//       console.error("Authentication error:", error);
//       return new Response("Authentication failed", { status: 500 });
//     }
//   },
// };
