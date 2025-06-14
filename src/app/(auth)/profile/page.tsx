"use client";

import { useAppHook } from "@/app/context/AppUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
};

export default function Profile() {
  const { userProfile, setUserProfile } = useAppHook();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(userProfile);

  const handleEdit = () => {
    if (userProfile) {
      setEditedProfile(userProfile); // pre-fill form
      setEditOpen(true);
    }
  };

  const handleDelete = () => {
    setDeleteOpen(true);
  };

  const handleEditSave = () => {
    if (editedProfile) {
      setUserProfile(editedProfile); // Update context
      setEditOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    setUserProfile(null); // Remove profile from context
    setEditedProfile(null); // Reset edited profile
    setDeleteOpen(false);
  };

  return (
    <div className="container mx-auto py-8">
      {userProfile ? (
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-muted-foreground">No Profile Found</p>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          {editedProfile && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editedProfile.name}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={editedProfile.email}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={editedProfile.phone || ""}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Gender</Label>
                <Input
                  value={editedProfile.gender || ""}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      gender: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditSave}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this profile?</p>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
