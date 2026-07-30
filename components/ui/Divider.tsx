type DividerProps = {
  gradient?: boolean;
  className?: string;
};

export default function Divider({
  gradient = false,
  className = "",
}: Readonly<DividerProps>) {
  const classes = gradient
    ? "pa-divider-gradient"
    : "pa-divider";

  return <div className={`${classes} ${className}`.trim()} />;
}