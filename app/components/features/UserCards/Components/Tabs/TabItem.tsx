import { motion } from "framer-motion";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { CardsItem } from "~/models/Cards";

type TabItemData = {
  data?: CardsItem;
  addButton?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  editor?: boolean;
};
const TabItem = ({
  data,
  addButton,
  onClick,
  onDelete,
  editor = false,
}: TabItemData) => {
  const [open, setOpen] = useState(false);

  if (addButton) {
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        onClick={onClick && onClick}
        className="cursor-pointer bg-gray-900 duration-150 hover:bg-gray-800 w-full h-70 border border-gray-800 rounded-2xl flex justify-center items-center"
      >
        <Plus size={50} />
      </div>
    );
  }
  if (!data) {
    return null;
  }
  return (
    <motion.div
      className="bg-gray-900 w-full h-70 relative overflow-hidden border border-gray-800 rounded-2xl"
      initial="initial"
      whileHover="hover"
      animate="initial"
      onClick={onClick && onClick}
      style={onClick && { cursor: "pointer" }}
    >
      {editor && (
        <>
          <motion.div
            className="absolute top-4 right-4 z-10"
            variants={{
              initial: {
                opacity: 0,
              },
              hover: {
                opacity: 1,
              },
            }}
          >
            <Button
              variant={"outline"}
              className="w-8 h-8 bg-gray-800/40"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              <Trash size={20} />
            </Button>
          </motion.div>
          <Dialog open={open}>
            <DialogContent
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <DialogHeader>
                <DialogTitle>Delete Item</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this item?
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-row justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    onDelete && onDelete();
                  }}
                  variant={"destructive"}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      <motion.img
        src={data.imageUrl}
        alt=""
        className="w-full h-full object-cover"
        transition={{ duration: 0.4 }}
        variants={{
          initial: {
            scale: 1,
          },
          hover: {
            scale: 1.1,
          },
        }}
      />
      <motion.div
        className="flex flex-col gap-2 p-4 h-full absolute left-0 top-0 text-white w-full select-none"
        transition={{ duration: 0.3 }}
        variants={{
          initial: {
            background: "rgba(0,0,0,0)",
            backdropFilter: "blur(0px)",
          },
          hover: {
            background: "rgba(0,0,100,0.1)",
            backdropFilter: "blur(20px)",
          },
        }}
      />
      <motion.div
        className="flex flex-col gap-2 p-4 h-full absolute left-0 text-white w-full select-none"
        transition={{ duration: 0.35 }}
        variants={{
          initial: {
            top: "100%",
            transform: "translateY(-60px)",
          },
          hover: {
            top: "60px",
          },
        }}
      >
        <motion.h2
          className="text-2xl font-bold"
          style={{ textShadow: "0px 0px 15px rgba(0, 0, 0, 0.7)" }}
          transition={{ duration: 0.45 }}
          variants={{
            initial: {
              textShadow: "0px 0px 15px rgba(0, 0, 0, 0.7)",
              marginBottom: "50px",
            },
            hover: {
              textShadow: "none",
              marginBottom: "0px",
            },
          }}
        >
          {data.title}
        </motion.h2>
        <motion.p
          className="text-sm"
          variants={{
            initial: { color: "rgba(255, 255, 255, 0)" },
            hover: { color: "rgba(255, 255, 255, 1)" },
          }}
        >
          {data.description}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default TabItem;
