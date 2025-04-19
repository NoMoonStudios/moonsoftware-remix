import { Image, Trash } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { UserInfo } from "~/types/init";
const Profile = ({ userInfo, onUpdate = () => {} }: { userInfo: UserInfo, onUpdate?: () => void }) => {
  const [displayName, setDisplayName] = useState(userInfo.displayName);
  const [pronouns, setPronouns] = useState(userInfo.pronouns);
  const [bio, setBio] = useState(userInfo.bio);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(userInfo.avatar);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>(userInfo.banner);

  const [loading, setLoading] = useState(false);
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = () => setBannerPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const deleteBanner = async () => {
    setLoading(true);
    const response = await fetch("/api/v1/profile/removeBanner", {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to delete banner");
    setBannerFile(null);
    onUpdate();
    setLoading(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append("displayName", displayName);
      formData.append("bio", bio);
      formData.append("pronouns", pronouns);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }
      const response = await fetch("/api/v1/profile/update", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to update profile");
      toast.success("Profile updated successfully");
      onUpdate();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDisplayName(userInfo.displayName);
    setPronouns(userInfo.pronouns);
    setBio(userInfo.bio);
    setAvatarPreview(userInfo.avatar);
    setBannerPreview(userInfo.banner);
  }, [userInfo]);

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Avatar Upload */}
      <div className="flex flex-row items-center gap-2">
        <div className="flex items-center gap-4">


          {/* AVATAR */}
          <div className="relative">
            <img
              src={avatarPreview || "/default-avatar.png"}
              alt="Avatar preview"
              className="w-32 h-32 rounded-full object-cover"
            />
            <motion.label 
              htmlFor="avatar" 
              className="absolute top-0 left-0 w-full h-full rounded-full flex justify-center items-center opacity-0 bg-black cursor-pointer"
              whileHover={{ opacity: .5 }}
            >
              <Image className="w-8 h-8"/>
            </motion.label>
          </div>


          {/* BANNER */}
          <div className="relative bg-black rounded w-64 h-32">
            {bannerPreview &&
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="w-full h-full rounded object-cover"
              />
            }
            <motion.label 
              htmlFor="banner" 
              className="absolute top-0 left-0 w-full h-full rounded flex justify-center items-center opacity-0 bg-black cursor-pointer"
              whileHover={{ opacity: .5 }}
            >
              <Image className="w-8 h-8"/>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  {bannerPreview && <Button variant={'secondary'} className="absolute z-10 top-2 right-2 w-8 h-8 rounded flex justify-center items-center cursor-pointer">
                  <Trash className="w-8 h-8"/>
                  </Button>}
                </AlertDialogTrigger>
                <AlertDialogPortal >
                  <AlertDialogOverlay />
                  <AlertDialogContent>
                    <AlertDialogTitle>
                      Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will take effect immediately
                    </AlertDialogDescription>
                    <div className="flex flex-row gap-2 justify-end">
                      
                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="cursor-pointer" onClick={deleteBanner}>Remove Banner</AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialogPortal>
              </AlertDialog>
            </motion.label>
          </div>




          {/* file inputs */}
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            disabled={loading}
          />
          <input
            type="file"
            id="banner"
            accept="image/*"
            onChange={handleBannerChange}
            className="hidden"
            disabled={loading}
          />
        </div>
      </div>
      {/* Display Name Input */}
      <div className="flex flex-row items-center gap-2">
        <p className="font-medium w-[120px]">Display Name</p>
        <Input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-min"
          disabled={loading}
        />
      </div>
      <div className="flex flex-row items-center gap-2">
        <p className="font-medium w-[120px]">Pronouns</p>
        <Input
          type="text"
          value={pronouns}
          onChange={(e) => setPronouns(e.target.value)}
          className="w-min"
          placeholder="Pronouns"
          disabled={loading}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-medium">Bio</p>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-sm h-30 resize-none"
          placeholder="Enter your bio"
          disabled={loading}
        />
      </div>

      {/* Save Button */}
      <div className="mt-auto flex justify-end">
      <Button
          onClick={handleSubmit}
          disabled={loading || !displayName.trim()}
          variant="outline"
          className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <><CgSpinner className="animate-spin"/>Saving...</> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;