type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({
  children,
  className = "",
}: Readonly<ContainerProps>) {
  return (
    <div className={`pa-container ${className}`.trim()}>
      {children}
    </div>
  );
}