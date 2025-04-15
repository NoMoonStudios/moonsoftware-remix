import { useState } from "react";
import { Button } from "~/components/ui/button";
import { UserInfo } from "~/types/init";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Portfolio = ({ userInfo }: { userInfo: UserInfo }) => {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // const res = await fetch(`/api/v1/portfolio/update`, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     username: userInfo.username
      //   })
      // })

      // if (!res.ok) throw new Error("Failed to update profile");
      
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
      {/* <div className="flex flex-col gap-2">
        <p className="font-medium">Display Name</p>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="p-2 border rounded w-min"
          disabled={loading}
        />
      </div> */}

      {/* Status Messages */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">Portfolio updated!</p>}

      {/* Save Button */}
      <div className="mt-auto flex justify-end">
      <Button
          onClick={handleSubmit}
          // disabled={loading}
          disabled
          variant="outline"
          className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Create Portfolio"}
        </Button>
      </div>
    </div>
  );
};

export default Portfolio;