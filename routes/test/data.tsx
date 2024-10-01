import { FreshContext, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { verifyJWTsession } from "@utils/jwt.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const cookies = getCookies(req.headers);
  console.log(cookies);

  const session = await verifyJWTsession(cookies.token);

  return ctx.render({ info: session });
}

export default function Home(props: PageProps) {
  return (
    <div>
      <h1>Provided data ist the flowing</h1>
      <a href="jwt">Test again</a>
      <p>{JSON.stringify(props.data.info)}</p>
    </div>
  );
}
