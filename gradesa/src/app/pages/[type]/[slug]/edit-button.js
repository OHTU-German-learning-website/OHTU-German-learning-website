"use client";

import { checkUseIsAdmin } from "@/context/user.context";
import { Button } from "@/components/ui/button";
import router from "next/navigation";
import { useUser } from "@/context/user.context";

export default function EditButton({ url }) {
  const { setActAs } = useUser();
  if (checkUseIsAdmin()) {
    return (
      <Button
        onClick={() => {
          setActAs({ label: "Lehrer", value: "admin" });
          router.redirect(url);
        }}
      >
        Edit Page
      </Button>
    );
  }
  return <></>;
}
