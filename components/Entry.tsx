interface EntryProps {
  contents: string;
}

export default function Entry(props: EntryProps) {
  return (
    <main class="py-8">
      <div class="p-3 rounded min-w-full min-h-[11rem] overflow-x-auto bg-gray-100 dark:bg-gray-800">
        <pre class="font-mono">
          {props.contents}
        </pre>
      </div>
    </main>
  );
}
