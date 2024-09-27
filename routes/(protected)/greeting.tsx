import { FreshContext, PageProps } from "$fresh/server.ts";

export function handler(req: Request, ctx: FreshContext) {
  console.log("ez a session ", ctx.state.session);
  console.log("ex a csoka:", ctx.state.session.user);

  return ctx.render({ userInfo: ctx.state.session.user });
}

export default function Home(props: PageProps) {
  return (
    <div>
      <h1>
        Welcome to the Login Page Mr. {props.state.session.user || "Nobody"}
      </h1>
      <a href="login">Login with Microsoft</a>
    </div>
  );
}
