import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { Paste, State } from "@/utils/types.ts";
import CopyToClipboardButton from "@/islands/CopyToClipboardButton.tsx";
import Line from "@/components/Line.tsx";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  GET(_req: Request, ctx: FreshContext<State>) {
    const paste = ctx.state.db.getPasteById(ctx.params.id);
    return paste === undefined ? ctx.renderNotFound() : ctx.render(paste);
  },
};

export default function PasteById(props: PageProps<Paste>) {
  const truncate = (str: string, n: number = 128) =>
    str.length > n ? `${str.substring(0, n - 1)}…` : str;

  return (
    <>
      <Head>
        <title>{truncate(props.data.contents)} | Denopaste</title>
      </Head>
      <main class="my-8">
        <div class="mb-6 flex items-center justify-end gap-x-4">
          <a
            class="px-4 py-2 font-semibold rounded-md text-gray-900"
            href={`/${props.data.id}/raw`}
          >
            View Raw
          </a>
          <CopyToClipboardButton contents={props.data.contents} />
        </div>
        <pre class="bg-gray-100 border rounded-md border-gray-300 overflow-x-scroll text-gray-900">
          {
            props.data.contents
              .split('\n')
              .map((line, index) => (<Line key={index} line={line} number={index} />))
          }
        </pre>
      </main>
    </>
  );
}
