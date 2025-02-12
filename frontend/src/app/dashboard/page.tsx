"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../lib/auth";
import { ApiResponse } from "../interfaces/api.interface";
import axios from "axios";

export default function DashboardPage() {
  const router = useRouter();
  const [dashboardInfo, setDashboardInfo] = useState<string>();
  const dashboardData = async (): Promise<ApiResponse> => {
    const user = getUser();
    const { data } = await axios.get<ApiResponse>("http://localhost:3000/dashboard",{
      headers: {
        Authorization: `Bearer ${user}`,
      },
    });
    return data;
  };
  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/login");
    }
    dashboardData().then((response) => {
      if ("message" in response) {
        setDashboardInfo(response.message);
      }
    });
  }, [router]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
      <p>You are logged in!</p>
      <p>{dashboardInfo}</p>
    </div>
  );
}