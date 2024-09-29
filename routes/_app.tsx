import { type PageProps } from "fresh";
import { asset } from "fresh/runtime";
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
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%221em%22 font-size=%2280%22>🦕</text></svg>"
        />
        <link
          rel="preload"
          href={asset("/fonts/FixelVariable.woff2")}
          as="font"
          type="font/woff2"
          crossorigin="true"
        />
        <link rel="stylesheet" type="text/css" href={asset("/styles.css")} />
      </head>
      <body class="flex flex-col px-4 sm:px-6 py-8 mx-auto min-h-screen max-w-screen-md text-gray-800">
        <Header />
        <Component />
        <Footer />
      </body>
    </html>
  );
}

export default define.page(App);
