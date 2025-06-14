"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppHook } from "@/app/context/AppUtils";

export default function HomePage() {
  const { userProfile } = useAppHook();

  return (
    <main className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4 text-primary">
        Welcome to User Profile Manager
      </h1>
      <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
        This is a simple profile management application where you can edit,
        view, and delete your personal information securely.
      </p>

      {userProfile ? (
        <Card className="max-w-md mx-auto mb-8 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-medium text-muted-foreground">Name:</span>{" "}
              {userProfile.name}
            </p>
            <p>
              <span className="font-medium text-muted-foreground">Email:</span>{" "}
              {userProfile.email}
            </p>
            <p>
              <span className="font-medium text-muted-foreground">Phone:</span>{" "}
              {userProfile.phone || "--"}
            </p>
            <p>
              <span className="font-medium text-muted-foreground">Gender:</span>{" "}
              {userProfile.gender || "--"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-muted-foreground mb-8">
          No profile data found. Please create or login to see your profile.
        </p>
      )}

      <div className="flex justify-center space-x-4">
        <Link href="/profile">
          <Button>Go to Profile</Button>
        </Link>
        {!userProfile && (
          <Link href="/sign-up">
            <Button variant="outline">Create Profile</Button>
          </Link>
        )}
      </div>
    </main>
  );
}
