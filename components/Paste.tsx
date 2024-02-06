interface PasteProps {
  id: string;
  contents: string;
}

export default function Paste({ id, contents }: PasteProps) {
  return (
    <main class="my-8">
      <div class="mb-6 flex items-center justify-end gap-x-4">
        <a
          class="px-4 py-2 font-semibold rounded-md text-gray-900 dark:text-white"
          href={`/${id}/raw`}
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
            contents
              .split('\n')
              .map((line, index) => (<Line key={index} line={line} index={index} />))
          }
      </pre>
      <script type="text/javascript" src="/copyToClipboard.js" />
    </main>
  );
}

interface LineProps {
  line: string;
  index: number;
}

function Line({ line, index }: LineProps) {
  const classes = [
    "before:bg-white",
    "before:dark:bg-inherit",
    "before:text-gray-600",
    "before:dark:text-gray-400",
    "before:inline-block",
    "before:mr-4",
    "before:pr-4",
    "before:w-16",
    "before:text-right",
    "before:content-[attr(data-line-number)]",
    "before:border-r",
    "before:border-gray-300",
    "before:dark:border-gray-500",
  ];

  return (
    <code
      data-line-number={index + 1}
      class={classes.join(" ")}
    >
      {line}
    </code>
  );
}
