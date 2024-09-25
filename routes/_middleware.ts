import { FreshContext } from "$fresh/server.ts";
import { getAuthenticatedUser } from "@utils/oauth.ts";

interface State {
  data: string;
}

export async function handler(req: Request, ctx: FreshContext<State>) {
  console.log(req.url);

  const user = await getAuthenticatedUser(req);
  if (!user) {
    // return new Response("Unauthorized", { status: 401 });
    console.error("Unauthorized");
  } else {
    console.log("Authorized");
  }

  //   ctx.state.data = "myData";
  const resp = await ctx.next();
  //   resp.headers.set("server", "fresh server");
  return resp;
}
