"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const LinkButton = ({
  href,
  children,
  variant = "outline",
  size = "md",
  className,
}) => {
  return (
    <Link href={href}>
      <Button variant={variant} size={size} width="fit" className={className}>
        {children}
      </Button>
    </Link>
  );
};
