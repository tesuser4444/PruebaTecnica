"use client";

import Link from "next/link";
import { logout, getUser } from "../lib/auth";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Navbar() {
  const [token, setToken] = useState<string>('');
  const router = useRouter();

  // Fetch the user token on component mount
  useEffect(() => {
    const _token = getUser();
    if (_token) {
      setToken(_token); // Set the token state correctly
    }
  }, []);

  // Handle logout
  const onLogout = () => {
    logout(); // Clear the token from storage
    setToken(''); // Clear the token state
    router.push('/'); // Redirect to the home page
  };

  return (
    <nav className="p-4 bg-blue-500 text-white flex justify-between">
      <Link href="/" className="font-bold">
        Home
      </Link>
      <div>
        {token ? ( // Check if token exists
          <>
            <Link href="/dashboard" className="mr-4">
              Dashboard
            </Link>
            <button onClick={onLogout}>Logout</button>
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