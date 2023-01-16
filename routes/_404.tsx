import { ErrorPageProps } from "$fresh/server.ts";

import ContentMeta from "@/components/ContentMeta.tsx";
import Header from "@/components/Header.tsx";
import ErrorCode from "@/components/ErrorCode.tsx";
import Footer from "@/components/Footer.tsx";

const TITLE = "Not Found | Deno Paste";

export default function ServerError(props: ErrorPageProps) {
  return (
    <body class="flex flex-col w-full h-full max-w-screen-sm mx-auto py-6 px-4 text-gray-900">
      <ContentMeta title={TITLE} url={props.url} />
      <Header />
      <ErrorCode
        error={props.error}
        code={404}
        description="Couldn't find what you're looking for."
      />
      <Footer />
    </body>
  );
}
