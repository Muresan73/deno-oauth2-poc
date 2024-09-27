import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { JWTSession, verifyJWTsession } from "@utils/jwt.ts";

interface UserState {
  session: JWTSession;
}

export async function handler(req: Request, ctx: FreshContext<UserState>) {
  const cookies = getCookies(req.headers);
  console.log(cookies);

  const session = await verifyJWTsession(cookies.token);
  console.log("try to add to session: ", session);
  ctx.state.session = session;
  const resp = await ctx.next();
  //   resp.headers.set("server", "fresh server");
  return resp;
}
