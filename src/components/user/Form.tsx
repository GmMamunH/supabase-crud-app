"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// 1. Zod Schema
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phone_number: z.string().min(2, {
    message: "Phone must be at least 2 characters.",
  }),
  gender: z.string().min(2, {
    message: "Gender must be at least 2 characters.",
  }),
});

type FormSchemaType = z.infer<typeof formSchema>;

// ✅ Supabase props type define:
// type UserFormProps = {
//   supabase: SupabaseClient;
// };

export default function UserForm() {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone_number: "",
      gender: "",
    },
  });

  const { reset } = form;

  // 4. Submit handler
  async function onSubmit(values: FormSchemaType) {
    const { error } = await supabase.from("users").insert([values]);

    if (error) {
      console.error("Error inserting data:", error.message);
      toast.error(`Error inserting data: ${error.message}`);
    } else {
      // toast(`Data inserted successfully`);
      toast.success("Data inserted successfully!");
      console.log("Data inserted successfully:", values);
      reset(); // ✅ Reset form after submit
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+8801XXXXXXXXX" {...field} />
              </FormControl>
              <FormDescription>This is your contact number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Input placeholder="Male/Female/Other" {...field} />
              </FormControl>
              <FormDescription>Please specify your gender.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
        <ToastContainer />
      </form>
    </Form>
  );
}
