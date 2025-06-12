"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useAppHook } from "@/app/context/AppUtils";
import { toast, ToastContainer } from "react-toastify";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, setAuthToken } = useAppHook();
  const router = useRouter();

  const handleUserLogout = async () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setAuthToken(null);
    await supabase.auth.signOut();
    toast.success("User logged out successfully");
    router.push("sign-in");
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Supabase CRUD</h1>
            </div>

            {isLoggedIn ? (
              <div className="ms-auto">
                <Link
                  className="me-3 text-gray-700 text-decoration-none"
                  href="/user"
                >
                  Dashboard
                </Link>
                <Link
                  className="me-3 text-gray-700 text-decoration-none"
                  href="/profile"
                >
                  Profile
                </Link>
                <button className="btn btn-danger" onClick={handleUserLogout}>
                  Logout
                </button>
                <ToastContainer/>
              </div>
            ) : (
              <div className="ms-auto">
                <Link
                  className="me-3 text-gray-700 text-decoration-none"
                  href="/"
                >
                  Home
                </Link>
                <Link
                  className="text-gray-700 text-decoration-none"
                  href="/sign-in"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
