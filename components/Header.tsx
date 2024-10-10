export default function Header() {
  return (
    <header>
      <hgroup class="flex-1">
        <h1 class="text-3xl font-bold">
          <a href="/">Deno Paste</a>
        </h1>
        <p class="text-gray-600 mt-1">
          A simple paste service built with Deno 🦕 and Fresh 🍋
        </p>
      </hgroup>
    </header>
  );
}
