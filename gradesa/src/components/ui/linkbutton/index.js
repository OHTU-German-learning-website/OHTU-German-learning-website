"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const LinkButton = ({ href, children }) => {
  return (
    <Link href={href}>
      <Button variant="outline" width="fit">
        {children}
      </Button>
    </Link>
  );
};
