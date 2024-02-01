import { Head } from "$fresh/runtime.ts";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Paste not found</title>
      </Head>
      <main class="my-24 text-center">
        <h2 class="text-3xl font-bold mb-4">Paste not found</h2>
        <p>
          Sorry, we couldn't find the paste you're looking for.
        </p>
        <p class="mb-8">
          Pastes are automatically deleted after one hour.
        </p>
        <a class="text-gray-900 hover:underline" href="/">
          Back to home
        </a>
      </main>
    </>
  );
}
