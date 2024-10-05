import type { FreshContext, PageProps } from "fresh";
import { HttpError, page } from "fresh";

import { define, type State } from "../../utils/define.ts";
import { getById } from "../../data/mod.ts";
import Paste from "../../data/paste.ts";
import { pageTitle } from "../../utils/title.ts";
import PasteActions from "../../islands/PasteActions.tsx";
import Line from "../../components/Line.tsx";

interface Data {
  paste: Paste;
}

export const handler = define.handlers<Data>({
  async GET(ctx: FreshContext<State>) {
    const paste = await getById(ctx.state.kv, ctx.params.id);

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
    <main class="mt-6 mb-8" data-testid="paste-contents">
      <PasteActions paste={paste} />
      <pre class="py-2 border-l border-r border-b rounded-b-md border-gray-300 overflow-auto shadow-sm">
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
