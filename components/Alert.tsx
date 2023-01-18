interface AlertProps {
  message: string | undefined;
}

export default function Alert(props: AlertProps) {
  if (props.message === undefined) {
    return null;
  }

  return (
    <div
      class="bg-red-100 border-red-400 absolute -top-12 right-0 mx-auto text-center border rounded px-3 py-2 z-10"
      role="alert"
    >
      <span>{props.message}</span>
    </div>
  );
}
