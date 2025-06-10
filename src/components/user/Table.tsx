"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
  phone_number: string;
  gender: string;
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(err.message);
      toast.error("Error fetching users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const { error } = await supabase.from("users").delete().eq("id", id);

      if (error) throw error;

      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Error deleting user");
      console.error(err);
    }
  };

  const startEditing = (user: User) => {
    setEditingId(user.id);
    setEditForm({ ...user });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      const { error } = await supabase
        .from("users")
        .update(editForm)
        .eq("id", editingId);

      if (error) throw error;

      setUsers(
        users.map((user) =>
          user.id === editingId ? { ...user, ...editForm } : user
        )
      );
      setEditingId(null);
      toast.success("User updated successfully");
    } catch (err) {
      toast.error("Error updating user");
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;
  if (users.length === 0) return <div>No users found</div>;

  return (
    <Table>
      <TableCaption>A list of users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              {editingId === user.id ? (
                <input
                  type="text"
                  name="username"
                  value={editForm.username || ""}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                user.username
              )}
            </TableCell>
            <TableCell>
              {editingId === user.id ? (
                <input
                  type="email"
                  name="email"
                  value={editForm.email || ""}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                user.email
              )}
            </TableCell>
            <TableCell>
              {editingId === user.id ? (
                <input
                  type="text"
                  name="phone_number"
                  value={editForm.phone_number || ""}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                user.phone_number
              )}
            </TableCell>
            <TableCell>
              {editingId === user.id ? (
                <select
                  name="gender"
                  value={editForm.gender || ""}
                  onChange={(e) => handleEditChange(e as any)}
                  className="border rounded px-2 py-1 w-full"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                user.gender
              )}
            </TableCell>
            <TableCell className="text-right space-x-2">
              {editingId === user.id ? (
                <>
                  <Button size="sm" variant="outline" onClick={saveEdit}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
