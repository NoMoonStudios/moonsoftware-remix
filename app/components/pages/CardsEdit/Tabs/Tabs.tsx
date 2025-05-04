import { Card } from "~/components/ui/card";
import TabItem from "./TabItem";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { CardsItem } from "~/models/Cards";
import { AnimatePresence, motion } from "framer-motion";
const TabData = {
  items: [
    {
      title: "child robux milker",
      description:
        "Tab 1 description Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.",
      image: "/work/building/5.png",
    },
    {
      title: "cousin was hung here",
      description:
        "Enhance your game map building skills with advanced techniques and strategies. Learn how to create detailed environments, manage resources, and balance gameplay. Get tips on how to make your maps more engaging and challenging for players.",
      image: "/work/building/3.png",
    },
    {
      title: "Romantic Sex location",
      description:
        "Tab 3 description Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.",
      image: "/work/building/2.png",
    },
    {
      title: "Gay Nigga",
      description:
        "Master the art of creating immersive game maps with our expert tips and tricks. Learn how to design intuitive and responsive maps, optimize performance, and balance visual and gameplay elements. Get insights on how to create a compelling narrative and build a strong brand for your game.",
      image: "/work/building/4.png",
    },
    {
      title: "Snow with dildo in fog",
      description:
        "Tab 3 description Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.",
      image: "/work/building/1.png",
    },
    {
      title: "Offbrand CSGO cases",
      description:
        "Master the art of creating immersive game maps with our expert tips and tricks. Learn how to design intuitive and responsive maps, optimize performance, and balance visual and gameplay elements. Get insights on how to create a compelling narrative and build a strong brand for your game.",
      image: "/work/building/6.png",
    },
    {
      title: "Prime Jumpoff Location",
      description:
        "Master the art of creating immersive game maps with our expert tips and tricks. Learn how to design intuitive and responsive maps, optimize performance, and balance visual and gameplay elements. Get insights on how to create a compelling narrative and build a strong brand for your game.",
      image: "/work/building/8.png",
    },
    {
      title: "A body was buried here",
      description:
        "Master the art of creating immersive game maps with our expert tips and tricks. Learn how to design intuitive and responsive maps, optimize performance, and balance visual and gameplay elements. Get insights on how to create a compelling narrative and build a strong brand for your game.",
      image: "/work/building/9.png",
    },
    {
      title: "Go under and it'll fall",
      description:
        "Tab 3 description Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.",
      image: "/work/building/10.png",
    },
  ],
};

const Tabs = () => {
  const [activeItem, setActiveItem] = useState<CardsItem | null>(null);

  const allItems = [...TabData.items, { addButton: true }];
  const ITEMS_PER_PAGE = 4;

  const fullDataPages = Math.floor(allItems.length / ITEMS_PER_PAGE);
  const remainder = allItems.length % ITEMS_PER_PAGE;

  const totalPages = remainder > 0 ? fullDataPages + 1 : fullDataPages;

  const [page, setPage] = useState(0);
  const startIdx = page * ITEMS_PER_PAGE;
  const pageItems = allItems.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const showPrev = page > 0;
  const showNext = page < totalPages - 1;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="relative w-180 ">
        <AnimatePresence>
          {activeItem ? (
            <motion.div
              key="modal"
              className="absolute h-160 w-full z-50 bg-gray-900/50 rounded-2xl -translate-y-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ChevronLeft
                size={30}
                className="hover:bg-gray-800 duration-200 rounded-full cursor-pointer absolute top-4 left-4"
                onClick={() => setActiveItem(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="main"
              className="absolute flex flex-col gap-4 min-h-80 -translate-y-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Tab headers */}
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Card
                    key={i}
                    className="p-4 py-2 cursor-pointer hover:bg-gray-800 duration-200"
                  >
                    Tab {i}
                  </Card>
                ))}
              </div>
              {/* Paginated content */}
              <Card className=" p-4">
                <div className="grid grid-cols-2 gap-4">
                  {pageItems.map((item, idx) =>
                    item.addButton ? (
                      <TabItem key="add-button" addButton />
                    ) : (
                      <TabItem
                        key={idx}
                        data={item as CardsItem}
                        onClick={() => setActiveItem(item as CardsItem)}
                      />
                    )
                  )}
                </div>

                {/* Pagination chevrons */}
                <div className="flex justify-between items-center mt-4">
                  {showPrev ? (
                    <ChevronLeft
                      size={40}
                      className="hover:bg-gray-800 duration-200 rounded-full cursor-pointer"
                      onClick={() => setPage((p) => p - 1)}
                    />
                  ) : (
                    <div className="w-10" />
                  )}

                  {showNext ? (
                    <ChevronRight
                      size={40}
                      className="hover:bg-gray-800 duration-200 rounded-full cursor-pointer"
                      onClick={() => setPage((p) => p + 1)}
                    />
                  ) : (
                    <div className="w-10" />
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs;
