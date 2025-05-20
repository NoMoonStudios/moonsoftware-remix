import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { CardsItem } from "~/models/Cards";

const ItemDialog = ({
  activeItem,
  setActiveItem,
}: {
  activeItem: CardsItem;
  setActiveItem: (item: CardsItem | null) => void;
}) => {
  return (
    // OPENED ITEM
    <motion.div
      key="modal"
      className="absolute w-280 z-50 rounded-2xl -translate-1/2 overflow-hidden flex gap-4 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ChevronLeft
        size={30}
        className="bg-gray-800/20 hover:bg-gray-800/80 duration-200 rounded-full cursor-pointer absolute top-4 left-4"
        onClick={() => setActiveItem(null)}
      />
      <div className="w-full overflow-hidden grow h-140" style={{
        backgroundImage: `url(${activeItem.imageUrl})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="text-2xl font-semibold">{activeItem.title}</div>
        <div className="text-gray-400">{activeItem.description}</div>
      </div>
    </motion.div>
  );
};

export default ItemDialog;
