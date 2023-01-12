import { asset, Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";

import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import UploadForm from "@/islands/UploadForm.tsx";

const TITLE = "Deno Paste";
const DESCRIPTION = "A minimal log upload service";

export default function MainPage(props: PageProps) {
  const ogImageUrl = new URL(asset("/og-image.png"), props.url).href;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={props.url.href} />
        <meta property="og:image" content={ogImageUrl} />
      </Head>

      <div class="bg-white flex flex-col w-full max-w-screen-sm mx-auto gap-8 px-8 py-8">
        <Header />
        <UploadForm />
        <Footer />
      </div>
    </>
  );
}
