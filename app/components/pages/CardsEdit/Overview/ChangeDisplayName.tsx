import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { UserInfo } from "~/types/init";

const ChangeDisplayName = ({ userInfo }: { userInfo: UserInfo }) => {
  const [displayName, setDisplayName] = useState(userInfo.displayName);
  const [loading, setLoading] = useState(false);
  const handleUpdate = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("displayName", displayName);
  
    
    const response = await fetch("/api/v1/profile/update", {
      method: "POST",
      body: formData,
    });
    setLoading(false);
    if (!response.ok) throw new Error("Failed to update profile");
    toast.success("Profile updated successfully");
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" className="w-full">Change Display Name</Button>
        </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Display Name</DialogTitle>
          <DialogDescription>
            Enter your new display name
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Display Name"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
        <Button onClick={handleUpdate} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default ChangeDisplayName