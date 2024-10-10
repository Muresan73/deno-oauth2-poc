import { PageProps } from "$fresh/server.ts";

export default function Error500Page({ error }: PageProps) {
  return <p>Authotentication failed</p>;
}
