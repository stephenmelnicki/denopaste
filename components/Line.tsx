interface LineProps {
  line: string;
  number: number;
}

export default function Line({ line, number }: LineProps) {
  const classes = [
    "before:bg-white",
    "before:text-gray-600",
    "before:inline-block",
    "before:mr-4",
    "before:pr-4",
    "before:w-16",
    "before:text-right",
    "before:content-[attr(data-line-number)]",
    "before:border-r",
    "before:border-gray-300",
  ];

  return (
    <code
      data-line-number={number + 1}
      class={classes.join(" ")}
    >
      {line}
    </code>
  );
}
