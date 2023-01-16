import { ErrorPageProps } from "$fresh/server.ts";

import ContentMeta from "@/components/ContentMeta.tsx";
import Header from "@/components/Header.tsx";
import ErrorCode from "@/components/ErrorCode.tsx";
import Footer from "@/components/Footer.tsx";

const TITLE = "Server Error | Deno Paste";

export default function ServerError(props: ErrorPageProps) {
  return (
    <body class="w-full max-w-screen-sm mx-auto py-6 px-4 text-gray-900">
      <ContentMeta title={TITLE} url={props.url} />
      <Header />
      <ErrorCode
        error={props.error}
        code={500}
        description="Something went wrong."
      />
      <Footer />
    </body>
  );
}
