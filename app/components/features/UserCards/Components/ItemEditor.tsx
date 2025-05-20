import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { Loader } from "lucide-react";
import { useState } from "react";
import TabItem from "./Tabs/TabItem";
import { toast } from "sonner";
import { CardsItem } from "~/models/Cards";
const ItemEditor = ({
  index,
  onAdd = () => {},
}: {
  index: number | null;
  onAdd: (item: CardsItem) => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);


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

  const upload = async () => {
    try {
      if (!imageFile || index === null) return;
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", imageFile);
      formData.append("tab", index.toString());
      const response = await fetch("/api/v1/cards/tabs/items/new", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update profile");
      
      onAdd({
        title: title,
        description: description,
        imageUrl: imagePreview,
      });
    } catch (error) {
      toast.error("Failed to upload image, please try again.");
    }
    setLoading(false);
    reset();
  };

  return (
    <Dialog open={imageFile !== null}>
      <label htmlFor="image-upload">
        <TabItem addButton onClick={reset} />
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
        <img
          src={imagePreview}
          className="w-full rounded-xl max-h-90 object-contain"
          alt=""
        />

        <Input
          disabled={loading}
          placeholder="Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          disabled={loading}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-none"
        />

        {selecting && (
          <div className="flex gap-2 items-center">
            <Loader className="animate-spin" />
            Selecting File...
          </div>
        )}
        <DialogFooter>
          <Button variant={"ghost"} onClick={reset} disabled={loading}>
            Cancel
          </Button>
          <Button variant={"default"} onClick={upload} disabled={loading}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemEditor;
