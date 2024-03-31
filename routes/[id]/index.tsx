import { FreshContext, PageProps } from "$fresh/server.ts";

import { Paste, State } from "@/utils/types.ts";
import CopyToClipboardButton from "@/islands/CopyToClipboardButton.tsx";
import Line from "@/components/Line.tsx";

export const handler = {
  GET(_req: Request, ctx: FreshContext<State>) {
    const paste = ctx.state.db.getPasteById(ctx.params.id);
    return paste === undefined ? ctx.renderNotFound() : ctx.render(paste);
  },
};

export default function PasteById(props: PageProps<Paste>) {
  return (
    <main class="my-8">
      <div class="mb-6 flex items-center justify-end gap-x-4">
        <a
          class="px-4 py-2 font-semibold rounded-md text-gray-900 dark:text-white"
          href={`/${props.data.id}/raw`}
        >
          View raw
        </a>
        <CopyToClipboardButton contents={props.data.contents} />
      </div>
      <pre class="bg-gray-100 dark:bg-neutral-800 border rounded-md border-gray-300 dark:border-gray-500 overflow-x-scroll text-gray-900 dark:text-white">
          {
            props.data.contents
              .split('\n')
              .map((line, index) => (<Line key={index} line={line} index={index} />))
          }
      </pre>
    </main>
  );
}
