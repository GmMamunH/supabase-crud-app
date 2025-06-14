"use client";

import UserForm from "@/components/_user/Form";
import { UserTable } from "@/components/_user/Table";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppHook } from "../context/AppUtils";

export default function UserPage() {
  const { isLoggedIn, isLoading } = useAppHook();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/sign-in");
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) return null; // or a loading spinner

  return (
    <>
      <h1 className="text-center p-3 text-3xl">Supabase CRUD App</h1>
      <div className="container mx-auto p-5 flex flex-col md:flex-row gap-10">
        <UserForm />
        <UserTable />
      </div>
    </>
  );
}
