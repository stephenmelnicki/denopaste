export default function Footer() {
  return (
    <footer class="mt-6 sm:mt-8 flex flex-wrap flex-col-reverse justify-center items-center gap-4 text-sm text-gray-600 sm:flex-row sm:justify-between">
      <span>
        &copy; 2024 Stephen Melnicki
      </span>
      <nav>
        <ul class="flex flex-row justify-center items-center gap-4">
          <li>
            <a
              class="p-2 hover:underline hover:text-blue-600"
              href="https://github.com/stephenmelnicki/denopaste"
              rel="noopener noreferrer"
              target="_blank"
            >
              Source
            </a>
          </li>
          <li>
            <a
              class="p-2 hover:underline hover:text-blue-600"
              href="https://raw.githubusercontent.com/stephenmelnicki/denopaste/main/LICENSE"
              rel="noopener noreferrer"
              target="_blank"
            >
              License
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
