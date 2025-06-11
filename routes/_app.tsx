import type { PageProps } from "fresh";

import type { State } from "utils/fresh.ts";
import Header from "components/Header.tsx";
import Footer from "components/Footer.tsx";

export default function App({ Component, state }: PageProps<never, State>) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{state.title}</title>
        <meta
          name="description"
          content="A simple plain text storage service built with Deno 🦕 and Fresh 🍋"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="/styles.css" />
      </head>
      <body class="flex flex-col px-4 sm:px-6 py-8 mx-auto min-h-screen max-w-screen-lg">
        <Header />
        <Component />
        <Footer />
      </body>
    </html>
  );
}
