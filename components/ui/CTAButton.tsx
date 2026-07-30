import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type CTAButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  fullWidth?: boolean;
  variant?: "default" | "header";
  target?: "_self" | "_blank";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function CTAButton({
  children,
  href,
  className = "",
  fullWidth = false,
  variant = "default",
  target = "_self",
  type = "button",
  ...props
}: Readonly<CTAButtonProps>) {
const classes = [
  "pa-button",
  variant === "header" ? "pa-button-header" : "",
  fullWidth ? "pa-button-full" : "",
  className,
]
  .filter(Boolean)
  .join(" ");

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}