import { FreshContext } from "$fresh/server.ts";
export async function handler(req: Request, ctx: FreshContext) {
  console.log(req.url);

  const resp = await ctx.next();
  //   resp.headers.set("server", "fresh server");
  return resp;
}
