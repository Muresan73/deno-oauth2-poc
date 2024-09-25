import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    // In a real app, you'd verify the access token here
    const accessToken = ""; // Get this from your session management
    const response = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = await response.json();
    return ctx.render({ userData });
  },
};

export default function Protected({ data }: PageProps) {
  return (
    <div>
      <h1>Protected Page</h1>
      <pre>{JSON.stringify(data.userData, null, 2)}</pre>
    </div>
  );
}
