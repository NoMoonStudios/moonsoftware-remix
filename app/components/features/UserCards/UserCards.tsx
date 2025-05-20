import { Card } from "~/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { CardsInfo, CardsItem, CardsTab } from "~/models/Cards";
import { AnimatePresence, motion } from "framer-motion";
import ItemEditor from "./Components/ItemEditor";
import DeleteTabButton from "./Components/TopBar/Buttons/DeleteTabButton";
import TabSelector from "./Components/TabSelector";
import { toast } from "sonner";
import EditTabNameButton from "./Components/TopBar/Buttons/EditTabNameButton";
import MainCard from "./MainCard";
import TabItem from "./Components/Tabs/TabItem";
import ItemDialog from "./Components/ItemDialog";
import TopBar from "./Components/TopBar/TopBar";

function UserCards({
  cardsInfo,
  setCardsInfo,
  editor = false,
  includeBanner = false,
  bordered = false,
}: {
  cardsInfo: CardsInfo;
  setCardsInfo: React.Dispatch<React.SetStateAction<CardsInfo>>;
  editor?: boolean;
  includeBanner?: boolean;
  bordered?: boolean;
}) {
  const [activeItem, setActiveItem] = useState<CardsItem | null>(null);
  const tabs = cardsInfo.tabs;
  const [selectedTabIndex, sSTI] = useState<number | null>(null);
  const selectedTab: CardsTab | null =
    selectedTabIndex !== null ? tabs[selectedTabIndex] : null;
  const allItems = editor ? [...(selectedTab?.items || []), { addButton: true }] : [...(selectedTab?.items || [])];
  const ITEMS_PER_PAGE = 4;

  const fullDataPages = Math.floor(allItems.length / ITEMS_PER_PAGE);
  const remainder = allItems.length % ITEMS_PER_PAGE;

  const totalPages = remainder > 0 ? fullDataPages + 1 : fullDataPages;

  const [page, setPage] = useState(0);
  const startIdx = page * ITEMS_PER_PAGE;
  const pageItems = allItems.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const showPrev = page > 0;
  const showNext = page < totalPages - 1;

  const setSelectedTabIndex = (idx: number | null) => {
    setPage(0);
    sSTI(idx);
    setActiveItem(null);
  };

  const setTabs = (tabs: CardsTab[]) => {
    setCardsInfo((prevCardsInfo) => ({ ...prevCardsInfo, tabs }));
  };

  const onNewItemAdded = (item: CardsItem) => {
    setTabs(
      tabs.map((tab, i) => {
        if (i === selectedTabIndex) {
          return { ...tab, items: [...tab.items, item] };
        }
        return tab;
      })
    );
  };

  const onItemDeleted = async (item: CardsItem) => {
    const idx = tabs[selectedTabIndex!]?.items?.findIndex(
      (v) => v.imageUrl === item.imageUrl
    );

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
              className="absolute flex flex-col min-h-120 -translate-1/2 w-180"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Tab headers */}
              {selectedTab !== null && (
                <TabSelector
                  tabs={tabs}
                  selectedTab={selectedTab}
                  setSelectedTabIndex={setSelectedTabIndex}
                  setTabs={setTabs}
                  editor={editor}
                />
              )}
              {/* Paginated content */}

              <Card
                className={
                  "rounded-tl-none min-h-100 flex flex-col " +
                  (selectedTab === null ? " bg-transparent border-0" :"p-4")
                }
              >
                {/* Header */}
                {editor && selectedTabIndex !== null && (
                  <TopBar
                    selectedTab={selectedTab}
                    selectedTabIndex={selectedTabIndex}
                    setSelectedTabIndex={setSelectedTabIndex}
                    setTabs={setTabs}
                    tabs={tabs}
                    allItems={allItems}
                  />
                )}

                {/* Items */}
                {selectedTab === null ? (
                  // MAIN TAB
                    <MainCard
                      selectedTab={selectedTab}
                      setSelectedTabIndex={setSelectedTabIndex}
                      setTabs={setTabs}
                      cardsInfo={cardsInfo}
                      editor={editor}
                      bordered
                    />
                ) : (
                  // SELECTED TAB
                  <>
                  <div className="grid grid-cols-2 gap-4">
                    {pageItems.map((item, idx) =>
                      item.addButton ? (
                        <ItemEditor
                          key={idx}
                          index={selectedTabIndex}
                          onAdd={onNewItemAdded}
                        />
                      ) : (
                        <TabItem
                          editor={editor}
                          key={idx}
                          data={item as CardsItem}
                          onClick={() => setActiveItem(item as CardsItem)}
                          onDelete={() => onItemDeleted(item as CardsItem)}
                        />
                      )
                    )}
                    </div>
                    {allItems.length === 0 && (
                      <div className="col-span-2 my-auto flex justify-center items-center text-gray-500">
                        This Tab is Empty
                      </div>
                    )}
                    </>
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
}

export default UserCards;
