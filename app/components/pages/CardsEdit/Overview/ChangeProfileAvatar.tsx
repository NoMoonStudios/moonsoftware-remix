import { File, Image, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { UserInfo } from "~/types/init";
import { motion } from "motion/react";
const ChangeProfileAvatar = ({ userInfo }: { userInfo: UserInfo }) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(userInfo.avatar);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleUpdate = async () => {
    setLoading(true);
    const formData = new FormData();

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const response = await fetch("/api/v1/profile/update", {
      method: "POST",
      body: formData,
    });
    setLoading(false);
    if (!response.ok) throw new Error("Failed to update profile");
    toast.success("Profile updated successfully");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
          Change Profile Avatar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Profile Image</DialogTitle>
          <DialogDescription>Select your new Profile Avatar</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 justify-center flex-col">
          <div className="relative w-32 h-32">
            <img
              src={avatarPreview || "/default-avatar.png"}
              alt="Avatar preview"
              className="w-32 h-32 rounded-full object-cover"
            />
            <motion.label
              // htmlFor="avatar"
              className="absolute top-0 left-0 w-full h-full rounded-full flex justify-center items-center opacity-0 bg-black cursor-pointer"
              whileHover={{ opacity: 0.5 }}
            >
              <Image className="w-8 h-8"/>
            </motion.label>
          </div>
          <Button disabled={loading} variant="outline" className="relative w-30">
            <label
              htmlFor="avatar"
              className="absolute top-0 left-0 w-full h-full flex justify-center items-center cursor-pointer gap-2"
            >
              <File /> Select File
            </label>
          </Button>

          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            disabled={loading}
          />
        </div>
        <Button onClick={handleUpdate} disabled={loading || !avatarFile}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeProfileAvatar;
