import type { JSX } from "preact";

interface Props {
  message: string;
  children: JSX.Element;
}

export default function Tooltip({ message, children }: Props) {
  return (
    <div
      class="group relative inline-block"
      data-testid="tooltip-container"
    >
      <span class="invisible group-hover:visible absolute -translate-x-1/3 bottom-full z-10 bg-black text-white text-sm shadow-md p-2 rounded whitespace-nowrap pointer-events-none">
        {message}
      </span>
      {children}
    </div>
  );
}
