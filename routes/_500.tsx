import { Head } from "$fresh/runtime.ts";

export default function ErrorPage() {
  return (
    <>
      <Head>
        <title>Denopaste | Server error</title>
      </Head>
      <main class="my-24 text-center">
        <h2 class="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white">
          Server error
        </h2>
        <p class="mt-6 text-gray-600 dark:text-gray-400 leading-7">
          Sorry, something went wrong. Please try again.
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
