import DenoIcon from "icons/brand-deno.tsx";

export default function Header() {
  return (
    <header>
      <a class="inline-flex flex-row items-center gap-2" href="/">
        <DenoIcon alt="Deno logo" />
        <h2 class="font-bold text-2xl">Deno Paste</h2>
      </a>
      <p>A minimal text storage service</p>
    </header>
  );
}
