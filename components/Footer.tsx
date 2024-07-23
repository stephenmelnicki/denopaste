export default function Footer() {
  return (
    <footer class="mt-16 flex flex-col justify-center items-center gap-4 text-gray-600 sm:flex-row sm:justify-between">
      <span>
        &copy; 2024 Stephen Melnicki
      </span>
      <ul class="flex flex-row justify-center items-center gap-8">
        <li>
          <a
            class="hover:underline"
            href="https://github.com/stephenmelnicki/denopaste"
            rel="noopener noreferrer"
            target="_blank"
          >
            Source
          </a>
        </li>
        <li>
          <a
            class="hover:underline"
            href="https://raw.githubusercontent.com/stephenmelnicki/denopaste/main/LICENSE"
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
