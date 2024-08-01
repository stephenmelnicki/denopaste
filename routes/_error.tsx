import { HttpError, type PageProps } from "fresh";

function processError(error: unknown): { code: number; description: string } {
  if (error instanceof HttpError) {
    if (error.status === 400) {
      return {
        code: 400,
        description: "Paste can't be empty. Please try again.",
      };
    }

    if (error.status === 404) {
      return {
        code: 404,
        description: "Couldn't find what you're looking for.",
      };
    }

    if (error.status === 405) {
      return {
        code: 405,
        description: "Method not allowed.",
      };
    }

    if (error.status === 413) {
      return {
        code: 413,
        description: "Paste is too long. Size limit is 64 KiB.",
      };
    }
  }

  return {
    code: 500,
    description: "Oops! Something went wrong.",
  };
}

export default function ErrorPage({ error }: PageProps) {
  const { code, description } = processError(error);

  return (
    <main class="mt-24 mb-16 text-center">
      <h2 class="text-7xl text-gray-900 font-bold">
        {code}
      </h2>
      <p class="mt-6 leading-7">
        {description}
      </p>
      <div class="mt-16">
        <a class="text-gray-600 hover:underline" href="/">
          Back to the Homepage
        </a>
      </div>
    </main>
  );
}
