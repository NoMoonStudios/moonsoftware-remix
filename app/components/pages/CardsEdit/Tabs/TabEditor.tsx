import { Card } from "~/components/ui/card";
import TabItem from "./TabItem";
import { ChevronLeft, ChevronRight, Pen, Trash } from "lucide-react";
import { useState } from "react";
import { CardsInfo, CardsItem, CardsTab } from "~/models/Cards";
import { AnimatePresence, motion } from "framer-motion";
import TabCreator from "./Components/TabCreator";
import { UserInfo } from "~/types/init";
import TabButton from "./TabButton";
import ItemDialog from "./ItemDialog";
import UserCards from "~/components/features/UserCards";
import DeleteTabButton from "./Components/DeleteTabButton";
import TabsTopBar from "./TabsTopBar";
import { toast } from "sonner";
import EditTabNameButton from "./Components/EditTabNameButton";

const TabEditor = ({
  userInfo,
  cardsInfo,
}: {
  userInfo: UserInfo;
  cardsInfo: CardsInfo;
}) => {
  const [activeItem, setActiveItem] = useState<CardsItem | null>(null);
  const [tabs, setTabs] = useState<CardsTab[]>(cardsInfo.tabs || []);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number | null>(null);
  const selectedTab: CardsTab | null = (selectedTabIndex !== null) ? tabs[selectedTabIndex] : null
  const allItems = [...(selectedTab?.items || []), { addButton: true }];
  const ITEMS_PER_PAGE = 4;
  
  const fullDataPages = Math.floor(allItems.length / ITEMS_PER_PAGE);
  const remainder = allItems.length % ITEMS_PER_PAGE;

  const totalPages = remainder > 0 ? fullDataPages + 1 : fullDataPages;

  const [page, setPage] = useState(0);
  const startIdx = page * ITEMS_PER_PAGE;
  const pageItems = allItems.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const showPrev = page > 0;
  const showNext = page < totalPages - 1;

  const onNewItemAdded = (item: CardsItem) => {
    setTabs(
      tabs.map((tab, i) => {
        if (i === selectedTabIndex) {
          return { ...tab, items: [...tab.items, item] };
        }
        return tab;
      })
    );
  }


const onItemDeleted = async (item: CardsItem) => {
  const idx = tabs[selectedTabIndex!]?.items?.findIndex((v) => v.imageUrl === item.imageUrl);

  if (idx === -1) return;
  
  const updatedTabs = tabs.map((tab, i) => {
    if (i === selectedTabIndex) {
      return {
        ...tab,
        items: tab.items.filter((v) => v.imageUrl !== item.imageUrl),
      };
    }
    return tab;
  });

  setTabs(updatedTabs);

  const res = await fetch("/api/v1/cards/tabs/items/delete", {
    method: "POST",
    body: JSON.stringify({ tab: selectedTabIndex, item: idx }),
  });

  if (res.status !== 200) {
    toast.error("Failed to delete item");
    const restoredTabs = [...updatedTabs];
    restoredTabs[selectedTabIndex!] = {
      ...restoredTabs[selectedTabIndex!],
      items: [
        ...restoredTabs[selectedTabIndex!].items.slice(0, idx),
        item,
        ...restoredTabs[selectedTabIndex!].items.slice(idx),
      ],
    };

    setTabs(restoredTabs);
  } else {
    toast.success("Item deleted successfully");
  }
};

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="relative">
        <AnimatePresence>
          {activeItem ? (
            <ItemDialog activeItem={activeItem} setActiveItem={setActiveItem} />
          ) : (
            // TABS AND ITEMS
            <motion.div
              key="main"
              className="absolute flex flex-col min-h-80 -translate-1/2 w-180"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Tab headers */}
              {selectedTab !== null && (
                <TabsTopBar
                  tabs={tabs}
                  selectedTab={selectedTab}
                  setSelectedTabIndex={setSelectedTabIndex}
                  setTabs={setTabs}
                />
              )}
              {/* Paginated content */}

              <Card
                className={
                  "p-4 rounded-tl-none " +
                  (selectedTab === null && " bg-transparent border-0")
                }
              >
                {/* Header */}
                {selectedTabIndex !== null && (
                  <div className="flex justify-end items-center gap-2 mb-2">
                    <EditTabNameButton
                      selectedTab={selectedTab}
                      selectedTabIndex={selectedTabIndex}
                      onRename={(name) => {
                        setTabs(
                          tabs.map((tab, i) => {
                            if (i === selectedTabIndex) {
                              return { ...tab, name: name };
                            }
                            return tab;
                          })
                        );
                      }}
                    />
                    <DeleteTabButton
                      onDelete={(deletedTab) => {
                        setTabs(tabs.filter((v) => v.name !== deletedTab.name));
                      }}
                      setSelectedTabIndex={setSelectedTabIndex}
                      selectedTab={selectedTab}
                      disabled={allItems.length > 1}
                    />
                  </div>
                )}

                {/* Items */}
                {selectedTab === null ? (
                  // MAIN TAB
                  <div className="relative h-70 mt-10">
                    <UserCards
                      tabs={tabs}
                      selectedTab={selectedTab}
                      setSelectedTabIndex={setSelectedTabIndex}
                      setTabs={setTabs}
                      data={cardsInfo}
                      bordered
                    />
                  </div>
                ) : (
                  // SELECTED TAB
                  <div className="grid grid-cols-2 gap-4">
                    {pageItems.map((item, idx) =>
                      item.addButton ? (
                        <TabCreator key={idx} index={selectedTabIndex} onAdd={onNewItemAdded} />
                      ) : (
                        <TabItem
                          key={idx}
                          data={item as CardsItem}
                          onClick={() => setActiveItem(item as CardsItem)}
                          onDelete={() => onItemDeleted(item as CardsItem)}
                        />
                      )
                    )}
                  </div>
                )}

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

export default TabEditor;
