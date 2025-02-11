"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../lib/auth";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    
    if (!user) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
      <p>You are logged in!</p>
    </div>
  );
}