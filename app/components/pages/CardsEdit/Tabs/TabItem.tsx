import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { CardsItem } from "~/models/Cards";

type TabItemData = {
  data?: CardsItem;
  addButton?: boolean;
  onClick?: () => void;
};
const TabItem = ({ data, addButton, onClick }: TabItemData) => {
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
              textShadow: "0px 0px 15px rgba(0, 0, 0, 0.7)" , 
              marginBottom: "50px"
            },
            hover: { 
              textShadow: "none", 
              marginBottom: "0px"
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
