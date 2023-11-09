import { Head } from "$fresh/runtime.ts";

export default function ContentMeta() {
  return (
    <Head>
      <title>Deno Paste</title>
      <meta name="description" content="A minimal plain text storage service" />
    </Head>
  );
}
