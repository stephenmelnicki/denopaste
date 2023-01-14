export interface Message {
  type: "success" | "error";
  contents: string;
  url: URL | undefined;
}

interface AlertProps {
  message: Message | undefined;
}

export default function Alert(props: AlertProps) {
  if (props.message === undefined) {
    return null;
  }

  return (
    <div
      class={`${
        props.message.type === "success"
          ? "bg-green-100 border-green-400 "
          : "bg-red-100 border-red-400"
      } absolute -top-12 right-0 mx-auto text-center border rounded px-3 py-2 z-10`}
      role="alert"
    >
      <span class={`${props.message.type === "success" && "font-bold"}`}>
        {props.message.contents}
      </span>
      {props.message.url && (
        <a
          class="block inline px-2 text-underline"
          href={props.message.url.href}
        >
          {props.message.url.href}
        </a>
      )}
    </div>
  );
}
