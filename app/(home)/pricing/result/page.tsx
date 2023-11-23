"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "../../../../packages/context";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const { hasPlus, setPlusStatus, user } = useAuthContext();
  if (hasPlus) {
    router.replace("/search");
  }

  useEffect(() => {
    if (user && sessionId) {
      setPlusStatus(user.uid);
    } else {
      router.replace("/pricing");
    }
  }, []);
}
