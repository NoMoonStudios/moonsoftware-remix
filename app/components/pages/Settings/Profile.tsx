import { useState, useRef } from "react";
import { Button } from "~/components/ui/button";
import { UserInfo } from "~/types/init";
const Profile = ({ userInfo }: { userInfo: UserInfo }) => {
  const [displayName, setDisplayName] = useState(userInfo.displayName);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(userInfo.avatar);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const formData = new FormData();
      formData.append("displayName", displayName);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      const response = await fetch("/api/v1/profile/update", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to update profile");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Display Name Input */}
      <div className="flex flex-col gap-2">
        <p className="font-medium">Display Name</p>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="p-2 border rounded w-min"
          disabled={loading}
        />
      </div>

      {/* Avatar Upload */}
      <div className="flex flex-col gap-2">
        <p className="font-medium">Profile Picture</p>
        <div className="flex items-center gap-4">
          <img
            src={preview || "/default-avatar.png"}
            alt="Avatar preview"
            className="w-16 h-16 rounded-full object-cover"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="p-2 border rounded"
            disabled={loading}
          />
        </div>
      </div>

      {/* Status Messages */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">Profile updated!</p>}

      {/* Save Button */}
      <div className="mt-auto flex justify-end">
      <Button
          onClick={handleSubmit}
          disabled={loading || !displayName.trim()}
          variant="outline"
          className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;