"use client";
import { myAppHook } from "@/app/context/AppUtils";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, setAuthToken } = myAppHook();
  const router = useRouter();
  const handleUserLogout = async () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setAuthToken(null);
    await supabase.auth.signOut();
    toast.success("User logged out successfully");
    router.push("/auth/login");
  };
  return (
    <div>
      {isLoggedIn ? (
        <div className="ms-auto">
          <Link className="me-3 text-decoration-none" href="/dashboard">
            Dashboard
          </Link>
          <Link className="me-3 text-decoration-none" href="/profile">
            Profile
          </Link>
          <button className="btn btn-danger" onClick={handleUserLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="ms-auto">
          <Link className="me-3 text-decoration-none" href="/">
            Home
          </Link>
          <Link className=" text-decoration-none" href="/sign-in">
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
