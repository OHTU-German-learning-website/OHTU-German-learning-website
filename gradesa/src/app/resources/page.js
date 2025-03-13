"use client";

import { useRouter } from "next/navigation";

export default function Chapter() {
  const router = useRouter();
  router.replace("/resources/1");
  return null;
}
