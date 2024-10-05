import { useMemo } from "preact/hooks";
import { HttpError, type PageProps } from "fresh";

export default function ErrorPage({ error }: PageProps) {
  const [code, description] = useMemo(() => {
    if (error instanceof HttpError) {
      if (error.status === 400 || error.status === 413) {
        return [error.status, error.message];
      }

      if (error.status === 404) {
        return [404, "Couldn't find what you're looking for."];
      }

      if (error.status === 405) {
        return [405, "Method not allowed."];
      }
    }

    return [500, "Oops! Something went wrong."];
  }, [error]);

  return (
    <main class="mt-24 mb-16 text-center">
      <h2 class="text-7xl font-bold">
        {code}
      </h2>
      <p class="mt-6 leading-7">
        {description}
      </p>
      <div class="mt-16">
        <a class="text-gray-500 hover:underline" href="/">
          Back to the Homepage
        </a>
      </div>
    </main>
  );
}
