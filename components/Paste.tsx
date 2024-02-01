interface PasteProps {
  id: string;
  contents: string;
}

export default function Paste({ id, contents }: PasteProps) {
  return (
    <main class="my-6">
      <div class="mb-6 flex items-center justify-end gap-x-4">
        <a
          class="px-4 py-2 font-semibold rounded-md"
          href={`/${id}/raw`}
        >
          View raw
        </a>
        <button
          id="copy-btn"
          class="px-4 py-2 font-semibold rounded-md bg-blue-600 text-white"
          type="button"
        >
          Copy to clipboard
        </button>
      </div>
      <pre class="bg-gray-100 dark:bg-neutral-800 border rounded-md border-gray-600 overflow-x-scroll">
          {
            contents
              .split('\n')
              .map((line, index) => (<Line key={index} line={line} index={index} />))
          }
      </pre>
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
    "before:border-gray-600",
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
