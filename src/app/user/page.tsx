import UserForm from "@/components/user/Form";
import { UserTable } from "@/components/user/Table";

export default function UserPage() {
  return (
    <>
      {" "}
      <h1 className="text-center p-3 text-3xl">Supabase CRUD App</h1>
      <div className="container mx-auto p-5 flex flex-col md:flex-row gap-10">
        <UserForm />
        <UserTable />
      </div>
    </>
  );
}