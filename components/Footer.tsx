export default function Footer() {
  return (
    <footer class="flex justify-between mt-14 text-sm text-gray-600">
      <span>&copy; 2024 Stephen Melnicki</span>
      <ul class="flex justify-end gap-4">
        <li>
          <a
            class="hover:underline"
            href="https://github.com/stephenmelnicki/deno_paste"
            rel="noopener noreferrer"
            target="_blank"
          >
            Source
          </a>
        </li>
        <li>
          <a
            class="hover:underline"
            href="https://raw.githubusercontent.com/stephenmelnicki/deno_paste/main/LICENSE"
            rel="noopener noreferrer"
            target="_blank"
          >
            License
          </a>
        </li>
      </ul>
    </footer>
  );
}
