import { Loader2, Trash } from "lucide-react";
import TabButton from "../TabButton";
import { CardsTab } from "~/models/Cards";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
const DeleteTabButton = ({
  setSelectedTabIndex,
  selectedTab,
  disabled = false,
  onDelete = () => {},
}: {
  setSelectedTabIndex: React.Dispatch<React.SetStateAction<number | null>>;
  selectedTab: CardsTab | null;
  disabled?: boolean;
  onDelete: (deleteTab: CardsTab) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!selectedTab) return null;

  const deleteTab = async () => {
    const name = selectedTab.name;
    setLoading(true);
    if (!name) return;
    const response = await fetch("/api/v1/cards/tabs/delete", {
      method: "POST",
      body: JSON.stringify({ name: name }),
    })
    setLoading(false);
    setOpen(false);
    if (!response.ok) return toast.error("Failed to deleted tab");
    setSelectedTabIndex(null);
    onDelete(selectedTab);
    toast.success("Tab deleted successfully");
  }

  return (
    <>
      <TabButton onClick={() => setOpen(true)} tooltip="Delete Tab">
        <Trash />
      </TabButton>
      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tab</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tab?
            </DialogDescription>
            
            <DialogDescription className="text-red-500">
              This action cannot be undone
            </DialogDescription>
            
            {disabled && <DialogDescription className="text-red-500">
              This Feature is Disabled - Deleting Non Empty Tab is Unimplemented
            </DialogDescription>}
          </DialogHeader>

          <div className="flex flex-row justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={deleteTab} disabled={loading || disabled} variant={"destructive"}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Tab
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteTabButton;
