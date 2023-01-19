import { ErrorPageProps } from "$fresh/server.ts";

import ContentMeta from "@/components/ContentMeta.tsx";
import ErrorCode from "@/components/ErrorCode.tsx";

const TITLE = "Server Error | Deno Paste";

export default function ServerError(props: ErrorPageProps) {
  return (
    <div>
      <ContentMeta title={TITLE} url={props.url} />
      <ErrorCode
        error={props.error}
        code={500}
        description="Something went wrong."
      />
    </div>
  );
}
