interface LineProps {
  line: string;
  index: number;
}

export default function Line({ line, index }: LineProps) {
  const classes = [
    "before:bg-white",
    "before:dark:bg-inherit",
    "before:text-gray-600",
    "before:dark:text-gray-400",
    "before:inline-block",
    "before:mr-4",
    "before:pr-4",
    "before:w-16",
    "before:text-right",
    "before:content-[attr(data-line-number)]",
    "before:border-r",
    "before:border-gray-300",
    "before:dark:border-gray-500",
  ];

  return (
    <code
      data-line-number={index + 1}
      class={classes.join(" ")}
    >
      {line}
    </code>
  );
}
