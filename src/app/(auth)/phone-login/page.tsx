"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function PhoneAuthPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Send OTP
  const handleSendOtp = async () => {
    if (!phone.startsWith("+880")) {
      alert("Phone number must be in +880 format");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      console.error("Error sending OTP:", error.message);
      alert(error.message);
    } else {
      setIsOtpSent(true);
      alert("OTP Sent!");
    }
    setLoading(false);
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });

    if (error) {
      console.error("Error verifying OTP:", error.message);
      alert("OTP Verification Failed");
    } else {
      console.log("Logged In:", data);
      alert("Logged in successfully!");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h1 className="text-2xl font-bold">Supabase Phone OTP Login</h1>

      <input
        type="text"
        placeholder="+8801XXXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 w-80"
      />

      {!isOtpSent && (
        <button
          onClick={handleSendOtp}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      )}

      {isOtpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-80"
          />
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
    </div>
  );
}
