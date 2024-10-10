import { type PageProps } from "fresh";

import { define, type State } from "../utils/define.ts";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

function App({ Component, state }: PageProps<never, State>) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {state.title ? <title>{state.title}</title> : null}
        <meta
          name="description"
          content="A simple paste service built with Deno 🦕 and Fresh 🍋"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="stylesheet" type="text/css" href="/styles.css" />
      </head>
      <body class="flex flex-col px-4 sm:px-6 py-8 mx-auto min-h-screen max-w-screen-md">
        <Header />
        <Component />
        <Footer />
      </body>
    </html>
  );
}

export default define.page(App);
