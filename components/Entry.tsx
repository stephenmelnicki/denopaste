interface EntryProps {
  contents: string;
}

export default function Entry(props: EntryProps) {
  return (
    <main>
      <div class="my-6 rounded min-w-full min-h-[11rem] overflow-x-auto bg-gray-100">
        <p class="p-2 font-mono">
          {props.contents}
        </p>
      </div>
    </main>
  );
}
