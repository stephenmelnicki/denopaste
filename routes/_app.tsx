import { AppProps } from "$fresh/server.ts";

import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";

export default function App({ Component }: AppProps) {
  return (
    <body class="w-full max-w-screen-sm mx-auto py-6 px-4 text-gray-900 text-lg">
      <Header />
      <Component />
      <Footer />
    </body>
  );
}
