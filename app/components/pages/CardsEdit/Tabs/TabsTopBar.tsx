import React from "react";
import { Card } from "~/components/ui/card";
import NewTabButton from "./Components/NewTabButton";
import { CardsTab } from "~/models/Cards";

const TabsTopBar = ({
  tabs,
  selectedTab,
  setSelectedTabIndex,
  setTabs,
  bordered=true,
}: {
  tabs: CardsTab[];
  selectedTab: CardsTab | null;
  setSelectedTabIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setTabs: React.Dispatch<React.SetStateAction<CardsTab[]>>;
  bordered?: boolean;
}) => {
  return (
    <div className="flex z-50">
      <Card
        className={
          "p-4 py-2 cursor-pointer bg-gray-950/20 backdrop-blur-lg hover:bg-gray-800 duration-200 rounded-none rounded-tl-2xl border-b-0 border-r-0 " +
          (selectedTab === null ? " bg-gray-800 " : "")+
          (bordered ? " " : " border-0")
        }
        onClick={() => setSelectedTabIndex(null)}
      >
        Main
      </Card>
      {tabs.map((v, i) => (
        // TABS
        <Card
          key={i}
          className={
            "p-4 py-2 cursor-pointer bg-gray-950/20 backdrop-blur-lg hover:bg-gray-800 duration-200 rounded-none border-b-0 border-r-0 " +
            (selectedTab?.name === v.name ? "bg-gray-800" : "")+
            (bordered ? " " : " border-0")
          }
          onClick={() => setSelectedTabIndex(i)}
        >
          {v.name}
        </Card>
      ))}
      {/* NEED TAB BUTTON */}
      <NewTabButton
        bordered={bordered}
        onUpdate={(name) =>
          setTabs([...(tabs || []), { name: name, items: [] }])
        }
      />
    </div>
  );
};

export default TabsTopBar;
