import { z } from "zod";

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "ফোন নাম্বার অবশ্যই ১০ সংখ্যার হতে হবে")
    .regex(/^\+8801[3-9][0-9]{8}$/, "বাংলাদেশের বৈধ ফোন নাম্বার দিন"),
});

export const otpSchema = z.object({
  otp: z.string().min(6, "৬ সংখ্যার OTP দিন"),
});
