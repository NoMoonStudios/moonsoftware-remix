import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useState } from "react";
import TabItem from "./TabItem";
const TabCreator = () => {
  const [selecting, setSelecting] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setSelecting(false);
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setSelecting(true);
    setImagePreview("");
    setImageFile(null);
  };

  return (
    <Dialog open={imageFile !== null}>
      <label htmlFor="image-upload">
        <TabItem addButton onClick={reset}/>
      </label>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new Tab Item</DialogTitle>
        </DialogHeader>
          <img src={imagePreview} className="w-full rounded-xl max-h-90 object-contain" alt="" />

        <Input placeholder="Name" />
        <Textarea placeholder="Description" className="resize-none" />

        {selecting && (
          <div className="flex gap-2 items-center">
            <Loader className="animate-spin" />
            Selecting File...
          </div>
        )}
        <DialogFooter>
            <Button variant={"ghost"} onClick={reset}>Cancel</Button>
            <Button variant={"default"} onClick={reset}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TabCreator;
