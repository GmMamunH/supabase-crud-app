"use client";

import { myAppHook } from "@/app/context/AppUtils";



export default function Profile() {
  const { userProfile } = myAppHook();

  return (
    <>

      {userProfile ? (
        <div className="container mt-5">
          <h2>Profile</h2>
          <div className="card p-4 shadow-sm">
            <p>
              {/* <strong>Name:</strong> {userProfile?.name} */}
              mamun
            </p>
            <p>
              {/* <strong>Email:</strong> {userProfile?.email}{" "} */}
              mamun@gmail.com
            </p>
            <p>
              {/* <strong>Phone:</strong> {userProfile?.phone} */}
              01406566242
            </p>
            <p>
              {/* <strong>Gender:</strong> {userProfile?.gender} */}
              male
            </p>
          </div>
        </div>
      ) : (
        <p>No Profile Found</p>
      )}

    </>
  );
}
