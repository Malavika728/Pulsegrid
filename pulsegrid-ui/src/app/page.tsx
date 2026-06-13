"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("pulsegrid_user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        const role = parsed.role;
        if (role === "Doctor") router.replace("/dashboard/doctor");
        else if (role === "Nurse") router.replace("/dashboard/nurse");
        else if (role === "Lab Tech") router.replace("/dashboard/lab");
        else if (role === "Hospital Admin") router.replace("/dashboard/admin");
        else if (role === "Patient") router.replace("/dashboard/patient");
        else router.replace("/auth/login");
      } catch {
        router.replace("/auth/login");
      }
    } else {
      router.replace("/auth/login");
    }
  }, [router]);

  return null;
}
