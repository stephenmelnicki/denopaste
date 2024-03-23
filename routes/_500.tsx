import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function ErrorPage({ error }: PageProps) {
  const message = (error as Error).message.includes("value too large")
    ? "Pastes are limited to a maximum size of 64 KiB."
    : "Sorry, something went wrong. Please try again.";

  return (
    <>
      <Head>
        <title>Server error</title>
      </Head>
      <main class="my-24 text-center">
        <h2 class="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white">
          Server error
        </h2>
        <p class="mt-6 text-gray-600 dark:text-gray-400 leading-7">{message}</p>
        <div class="mt-8">
          <a class="text-gray-900 dark:text-white hover:underline" href="/">
            Back to home
          </a>
        </div>
      </main>
    </>
  );
}
