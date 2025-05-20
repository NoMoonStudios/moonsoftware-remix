import { Loader2, Pen } from "lucide-react";
import TabButton from "../TabButton";
import { CardsTab } from "~/models/Cards";
import { useEffect, useState } from "react";
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
const EditTabNameButton = ({
  selectedTab,
  selectedTabIndex,
  onRename = () => {},
}: {
  selectedTabIndex: number | null;
  selectedTab: CardsTab | null;
  onRename: (newName: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(selectedTab?.name);
  const [disabled, setDisabled] = useState(false);


  const renameTab = async () => {
    if (!name || selectedTabIndex === null) return;
    
    setLoading(true);
    const response = await fetch("/api/v1/cards/tabs/rename", {
      method: "POST",
      body: JSON.stringify({ index: selectedTabIndex, name: name }),
    })

    setLoading(false);
    setOpen(false);
    if (!response.ok) return toast.error("Failed to rename tab");
    onRename(name);
    toast.success("Tab Renamed successfully");
  }
  const updateName = (newName: string) => {
    setName(newName);
    if (
      (newName === selectedTab?.name) || 
      selectedTabIndex === null || 
      newName.length < 1) {
        setDisabled(true) 
        return
    }
    setDisabled(false);
  };
  useEffect(() => {
    updateName(selectedTab?.name || "");
  }, [selectedTab]);

  if (!selectedTab) return null;




  return (
    <>
      <TabButton onClick={() => setOpen(true)} tooltip="Rename Tab">
        <Pen />
      </TabButton>
      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Tab</DialogTitle>
            
            <DialogDescription>
              Enter New Tab Name
            </DialogDescription>
          </DialogHeader>

          <Input
            disabled={loading}
            placeholder="Tab Name"
            value={name}
            onChange={(e) => updateName(e.target.value)}
          />

          <div className="flex flex-row justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={renameTab} disabled={loading || disabled}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Rename
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditTabNameButton;
