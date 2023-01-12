import DenoIcon from "icons/brand-deno.tsx";

export default function Header() {
  return (
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <DenoIcon />
        <h2 class="font-bold text-2xl">Deno Paste</h2>
      </div>

      <p class="text-gray-700">A minimal log upload service</p>
    </div>
  );
}
