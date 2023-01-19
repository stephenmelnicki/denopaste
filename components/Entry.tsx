interface EntryProps {
  contents: string;
}

export default function Entry(props: EntryProps) {
  return (
    <main class="py-8">
      <div class="rounded min-w-full min-h-[11rem] overflow-x-auto bg-gray-100">
        <pre class="p-2 font-mono">
          {props.contents}
        </pre>
      </div>
    </main>
  );
}
