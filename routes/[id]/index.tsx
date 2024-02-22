import { Handlers, PageProps } from "$fresh/server.ts";

import { getPasteById } from "@/utils/db.ts";
import Line from "@/components/Line.tsx";

interface Paste {
  id: string;
  contents: string;
}

export const handler: Handlers = {
  async GET(_req, ctx) {
    const id = ctx.params.id;
    const contents = await getPasteById(id);

    return contents === null
      ? ctx.renderNotFound()
      : ctx.render({ id, contents });
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
        <button
          id="copy-btn"
          class="px-4 py-2 font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-500"
          type="button"
        >
          Copy to clipboard
        </button>
      </div>
      <pre class="bg-gray-100 dark:bg-neutral-800 border rounded-md border-gray-300 dark:border-gray-500 overflow-x-scroll text-gray-900 dark:text-white">
          {
            props.data.contents
              .split('\n')
              .map((line, index) => (<Line key={index} line={line} index={index} />))
          }
      </pre>
      <script type="text/javascript" src="/copyToClipboard.js" />
    </main>
  );
}
