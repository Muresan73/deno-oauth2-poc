import { FreshContext, PageProps } from "$fresh/server.ts";

export function handler(req: Request, ctx: FreshContext) {
  console.log("ez a session ", ctx.state.session);
  console.log("ex a csoka:", ctx.state);

  return ctx.render({ userInfo: ctx.state });
}

export default function Home(props: PageProps) {
  return (
    <div>
      <h1>
        Welcome to the Login Page Mr.{" "}
        {JSON.stringify(props.data.userInfo) || "Nobody"}
      </h1>
      <a href="login">Login with Microsoft</a>
    </div>
  );
}
