"use client";

import Loader from "@/components/Loader";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// interface UserProfile {
//   id: string;
//   email: string;
//   // Add other fields as needed based on your user profile structure
// }

export type UserProfile = {
  id: string;
  name: string; // Added name property
  email: string;
  phone?: string;
  gender?: string;
};

interface AppUtilsType {
  isLoggedIn: boolean;
  setIsLoggedIn: (state: boolean) => void;
  authToken: string | null;
  setAuthToken: (state: string | null) => void;
  userProfile: UserProfile | null;
  setUserProfile: (state: UserProfile | null) => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
}

const AppUtilsContext = createContext<AppUtilsType | undefined>(undefined);

export const AppUtilsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setAuthToken(data.session.access_token);
        setIsLoggedIn(true);
        localStorage.setItem("access_token", data.session.access_token);
      } else {
        setAuthToken(null);
        setIsLoggedIn(false);
        localStorage.removeItem("access_token");
      }
      setIsLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.access_token) {
          setAuthToken(session.access_token);
          setIsLoggedIn(true);
          localStorage.setItem("access_token", session.access_token);
        } else {
          setAuthToken(null);
          setIsLoggedIn(false);
          localStorage.removeItem("access_token");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AppUtilsContext.Provider
      value={{
        isLoggedIn,
        setAuthToken,
        setIsLoggedIn,
        authToken, // ✅ Must include this
        userProfile,
        setUserProfile,
        isLoading,
        setIsLoading,
      }}
    >
      {isLoading ? <Loader /> : children}
    </AppUtilsContext.Provider>
  );
};

export const useAppHook = () => {
  const context = useContext(AppUtilsContext);
  if (!context) {
    throw new Error(
      "App Utils functions must be wrapped inside AppUtils Provider"
    );
  }
  return context;
};
