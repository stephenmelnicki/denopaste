import { ErrorPageProps } from "$fresh/server.ts";

import ContentMeta from "@/components/ContentMeta.tsx";
import ErrorCode from "@/components/ErrorCode.tsx";

const TITLE = "Not Found | Deno Paste";

export default function ServerError(props: ErrorPageProps) {
  return (
    <div>
      <ContentMeta title={TITLE} url={props.url} />
      <ErrorCode
        error={props.error}
        code={404}
        description="Couldn't find what you're looking for."
      />
    </div>
  );
}
