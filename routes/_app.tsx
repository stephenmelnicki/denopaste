import { PageProps } from "$fresh/server.ts";

import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html lang="en-US">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Deno Paste</title>
        <meta
          name="description"
          content="A plain text storage service for Deno 🦕"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%221em%22 font-size=%2280%22>🦕</text></svg>"
        >
        </link>
        <link rel="stylesheet" type="text/css" href="/styles.css" />
      </head>
      <body class="px-4 py-8 mx-auto max-w-screen-md">
        <Header />
        <Component />
        <Footer />
      </body>
    </html>
  );
}
