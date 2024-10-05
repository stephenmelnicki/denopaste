interface LineProps {
  line: string;
  number: number;
}

export default function Line(props: LineProps) {
  const classes = [
    "before:bg-white",
    "before:text-gray-500",
    "before:inline-block",
    "before:mr-4",
    "before:pr-4",
    "before:w-16",
    "before:text-right",
    "before:content-[attr(data-line-number)]",
  ];

  return (
    <code
      data-line-number={props.number + 1}
      class={classes.join(" ")}
    >
      {props.line}
    </code>
  );
}
