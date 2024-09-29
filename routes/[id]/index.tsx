import type { FreshContext, PageProps } from "fresh";
import { HttpError, page } from "fresh";
import CopyToClipboardButton from "../../islands/CopyToClipboardButton.tsx";
import Line from "../../components/Line.tsx";
import Paste from "../../data/paste.ts";
import { define, type State } from "../../utils/define.ts";
import { pageTitle } from "../../utils/title.ts";

interface Data {
  paste: Paste;
}

export const handler = define.handlers<Data>({
  async GET(ctx: FreshContext<State>) {
    const { db } = ctx.state;
    const paste = await db.getPasteById(ctx.params.id);

    if (!paste) {
      throw new HttpError(404);
    }

    ctx.state.title = pageTitle(paste.contents);
    return page({ paste });
  },
});

function PasteById(props: PageProps<Data>) {
  const { paste } = props.data;

  return (
    <main class="mt-6 mb-16">
      <div class="mb-6 flex items-center justify-end gap-x-4">
        <a
          class="px-4 py-2 font-semibold rounded-md"
          href={`/${paste.id}/raw`}
        >
          View Raw
        </a>
        <CopyToClipboardButton contents={paste.contents} />
      </div>
      <pre class="bg-gray-100 border rounded-md border-gray-300 overflow-auto">
        {
          paste.contents
            .split('\n')
            .map((line, index) => (<Line line={line} number={index} />))
        }
      </pre>
    </main>
  );
}

export default define.page(PasteById);
