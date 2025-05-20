import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

const NewTabButton = ({
  bordered = true,
  onUpdate = () => {},
}: {
  onUpdate: (name: string) => void;
  bordered?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const addTab = async () => {
    setLoading(true);
    if (!name) return;
    const response = await fetch("/api/v1/cards/tabs/new", {
      method: "POST",
      body: JSON.stringify({ name: name }),
    });
    setLoading(false);
    setOpen(false);
    if (!response.ok) return toast.error("Failed to add tab");
    onUpdate(name);
    toast.success("Tab added successfully");
  };

  return (
    <>
      <Card
        className={
          "p-4 py-2 cursor-pointer bg-gray-950/20 backdrop-blur-lg hover:bg-gray-800 duration-200 rounded-none rounded-tr-2xl border-b-0 " +
          (bordered ? "" : "border-0")
        }
        onClick={() => setOpen(true)}
      >
        +
      </Card>
      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Tab</DialogTitle>
            <DialogDescription>name your new card Tab</DialogDescription>
          </DialogHeader>

          <Input
            type="text"
            placeholder="Tab Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <div className="flex flex-row justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={addTab} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Tab
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewTabButton;
