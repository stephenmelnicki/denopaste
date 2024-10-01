import { useCallback, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import type { JSX } from "preact";

interface Props {
  className?: string;
  label: string;
  children: JSX.Element;
}

export default function Tooltip({ className = "", label, children }: Props) {
  const tooltip = useRef<HTMLDivElement>(null);
  const hidden = useSignal<boolean>(true);

  const onMouseEnter = useCallback(() => hidden.value = false, []);
  const onMouseLeave = useCallback(() => hidden.value = true, []);

  return (
    <div
      ref={tooltip}
      class={`group relative w-max ${className}`}
      data-testid="tooltip-container"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        hidden={hidden.value}
        class={`absolute -translate-y-12 -translate-x-12 transition duration-75 ease-in-out z-10 bg-gray-100 rounded p-2 shadow-md text-nowrap pointer-events-none`}
      >
        <span class="text-sm">{label}</span>
      </div>
      {children}
    </div>
  );
}
