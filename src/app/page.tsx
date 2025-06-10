import UserForm from "@/components/user/Form";
import { UserTable } from "@/components/user/Table";
// import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  return (
    <>
      <div className="container mx-auto p-5 flex flex-col gap-3">
        <UserForm />
        <UserTable />
      </div>
    </>
  );
}
