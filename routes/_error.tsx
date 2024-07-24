import { HttpError, type PageProps } from "fresh";

export function ServerCodePage(
  props: { serverCode: number; codeDescription: string },
) {
  return (
    <main class="mt-24 mb-16 text-center">
      <h2 class="text-7xl text-gray-900 font-bold">
        {props.serverCode}
      </h2>
      <p class="mt-6 leading-7">
        {props.codeDescription}
      </p>
      <div class="mt-16">
        <a class="text-gray-600 hover:underline" href="/">
          Back to the Homepage
        </a>
      </div>
    </main>
  );
}

export default function PageNotFound(props: PageProps) {
  const error = props.error;

  if (error instanceof HttpError) {
    if (error.status === 400) {
      return ServerCodePage({
        serverCode: 400,
        codeDescription: "Paste can not be empty. Please try again.",
      });
    }

    if (error.status === 404) {
      return ServerCodePage({
        serverCode: 404,
        codeDescription: "Couldn't find what you're looking for.",
      });
    }

    if (error.status === 413) {
      return ServerCodePage({
        serverCode: 413,
        codeDescription: "Paste is too long. Size limit is 64 KiB.",
      });
    }
  }

  return ServerCodePage({
    serverCode: 500,
    codeDescription: "Oops! Something went wrong.",
  });
}
