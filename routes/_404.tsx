import { Head } from "$fresh/runtime.ts";

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Denopaste | Paste not found</title>
      </Head>
      <main class="my-24 text-center">
        <h2 class="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white">
          Paste not found
        </h2>
        <p class="mt-6 text-gray-600 dark:text-gray-400 leading-7">
          Sorry, we couldn't find the paste you're looking for.
        </p>
        <div class="mt-8">
          <a class="text-gray-900 dark:text-white hover:underline" href="/">
            Back to home
          </a>
        </div>
      </main>
    </>
  );
}
