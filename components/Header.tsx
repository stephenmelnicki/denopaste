import DenoIcon from "icons/brand-deno.tsx";

export default function Header() {
  return (
    <header>
      <div class="flex items-center gap-2">
        <DenoIcon alt="Deno logo" />
        <h2 class="font-bold text-2xl">Deno Paste</h2>
      </div>
      <p>A minimal text storage service</p>
    </header>
  );
}
