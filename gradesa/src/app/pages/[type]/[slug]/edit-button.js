"use client";

import { checkUseIsAdmin } from "@/context/user.context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user.context";

export default function EditButton({ url }) {
  const { setActAs } = useUser();
  const router = useRouter();
  if (checkUseIsAdmin()) {
    return (
      <Button
        onClick={() => {
          setActAs({ label: "Lehrer", value: "admin" });
          router.push(url);
        }}
      >
        Edit Page
      </Button>
    );
  }
  return <></>;
}
