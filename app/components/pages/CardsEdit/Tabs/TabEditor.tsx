import { Card } from "~/components/ui/card";
import { ChevronLeft, ChevronRight, Pen, Trash } from "lucide-react";
import { useState } from "react";
import { CardsInfo, CardsItem, CardsTab } from "~/models/Cards";
import { AnimatePresence, motion } from "framer-motion";
import ItemEditor from "../../../features/UserCards/Components/ItemEditor";
import { UserInfo } from "~/types/init";
import ItemDialog from "../../../features/UserCards/Components/ItemDialog";
import UserCards from "~/components/features/UserCards/UserCards";
import DeleteTabButton from "../../../features/UserCards/Components/TopBar/Buttons/DeleteTabButton";
import TabsTopBar from "./TabsTopBar";
import { toast } from "sonner";
import EditTabNameButton from "../../../features/UserCards/Components/TopBar/Buttons/EditTabNameButton";

const TabEditor = ({
  activeItem,
  setActiveItem,
  selectedTab,
  setSelectedTabIndex,
  tabs,
  setTabs,
  selectedTabIndex,

}: {

}) => {


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
                        <ItemEditor key={idx} index={selectedTabIndex} onAdd={onNewItemAdded} />
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
