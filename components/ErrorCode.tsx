interface ErrorProps {
  error: unknown;
  code: number;
  description: string;
}

export default function ErrorCode(props: ErrorProps) {
  return (
    <main>
      <div class="py-20 min-w-full text-center">
        <h1 class="font-extrabold text-5xl leading-10">{props.code}</h1>
        <h2 class="mt-4 font-light text-2xl">
          {props.description}
        </h2>
      </div>
    </main>
  );
}
