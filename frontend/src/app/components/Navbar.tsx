"use client";

import Link from "next/link";
import { logout, getUser } from "../lib/auth";

export default function Navbar() {
  const user = getUser();

  return (
    <nav className="p-4 bg-blue-500 text-white flex justify-between">
      <Link href="/" className="font-bold">
        Home
      </Link>
      <div>
        {user ? (
          <>
            <Link href="/dashboard" className="mr-4">
              Dashboard
            </Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="mr-4">
              Login
            </Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}