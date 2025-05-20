import React from "react";
import EditTabNameButton from "./Buttons/EditTabNameButton";
import DeleteTabButton from "./Buttons/DeleteTabButton";
import { CardsItem, CardsTab } from "~/models/Cards";

const TopBar = ({
  selectedTab,
  selectedTabIndex,
  setSelectedTabIndex,
  setTabs,
  tabs,
  allItems,
}: {
  selectedTab: CardsTab | null;
  selectedTabIndex: number | null;
  setSelectedTabIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setTabs: (tabs: CardsTab[]) => void;
  tabs: CardsTab[];
  allItems: (
    | CardsItem
    | {
        addButton: boolean;
      }
  )[];
}) => {
  return (
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
  );
};

export default TopBar;
