"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAppHook } from "@/app/context/AppUtils";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, setAuthToken } = useAppHook();
  const router = useRouter();
  const pathname = usePathname();

  const handleUserLogout = async () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setAuthToken(null);
    await supabase.auth.signOut();
    toast.success("User logged out successfully");
    router.push("/sign-in");
  };

  // Reusable NavLink with active class
  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          isActive
            ? "bg-primary text-white"
            : "text-gray-700 hover:bg-gray-100 transition-colors"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-primary">
              Supabase CRUD
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4 ms-auto">
              {isLoggedIn ? (
                <>
                  <NavLink href="/dashboard" label="Dashboard" />
                  <NavLink href="/profile" label="Profile" />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleUserLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <NavLink href="/" label="Home" />
                  <NavLink href="/sign-in" label="Login" />
                </>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </nav>
    </>
  );
};

export default Navbar;
