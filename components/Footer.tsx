import LemonIcon from "icons/lemon-2.tsx";
import GithubIcon from "icons/brand-github.tsx";

export default function Footer() {
  return (
    <div class="flex flex-1 justify-end gap-4 text-sm">
      <a
        class="flex items-center gap-1 cursor-pointer hover:(text-green-500)"
        href="https://fresh.deno.dev"
        rel="noopener noreferrer"
        target="_blank"
      >
        <LemonIcon />
        Made with Fresh
      </a>

      <a
        class="flex items-center gap-1 cursor-pointer hover:(text-green-500)"
        href="https://github.com/stephenmelnicki/denopaste"
        rel="noopener noreferrer"
        target="_blank"
      >
        <GithubIcon />
        View Source
      </a>
    </div>
  );
}

// hover:(bg-green-200 border-green-500)
