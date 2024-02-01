import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function Error({ error }: PageProps) {
  const message = (error as Error).message.includes("value too large")
    ? "Pastes are limited to a maximum size of 64 KiB."
    : "Sorry, something went wrong. Please try again.";

  return (
    <>
      <Head>
        <title>Server error</title>
      </Head>
      <main class="my-24 text-center">
        <h2 class="text-3xl font-bold mb-4">Server error</h2>
        <p class="mb-8">{message}</p>
        <a class="text-gray-900 hover:underline" href="/">
          Back to home
        </a>
      </main>
    </>
  );
}
