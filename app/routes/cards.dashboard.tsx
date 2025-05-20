import { Layers, Link2, Palette, Table, Table2, UserCog } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import UserCards from "~/components/features/UserCards";
import Overview from "~/components/pages/CardsEdit/Overview";
import Settings from "~/components/pages/CardsEdit/Settings";
import TabEditor from "~/components/pages/CardsEdit/Tabs";
import Navigation from "~/components/pages/Navigation";
import Profile from "~/components/pages/Settings/Profile";
import MovingParticles from "~/components/particles/matrix";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { GetUserSession } from "~/lib/Utilities/client";
import { CardsInfo } from "~/models/Cards";
import { UserInfo } from "~/types/init";

const Temp = () => {
  return (
    <div className="flex justify-center items-center w-full h-full text-3xl text-gray-600">
      Coming Soon
    </div>
  );
};

function PortfolioPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
  const [cardsInfo, setCardsInfo] = useState<CardsInfo | undefined>();
  const [loading, setLoading] = useState(false);

  const accordionViews: { [key: string]: JSX.Element } = userInfo
    ? {
        Overview: <Overview userInfo={userInfo} />,
        Analytics: <Temp />,
        Settings: <Settings userInfo={userInfo} />,
        Badges: <Temp />,
      }
    : {};

  const views: {
    [key: string]: {
      title: string;
      icon: JSX.Element;
      content: JSX.Element;
      requiresCards?: boolean;
    };
  } = userInfo
    ? {
        // Links: {
        //   title: "Links",
        //   icon: <Link2 />,
        //   content: <Temp/>
        // },
        Customize: {
          title: "Customize",
          icon: <Palette />,
          content: <Temp />,
        },
        Tabs: {
          title: "Tabs",
          icon: <Layers />,
          requiresCards: true,
          content: <UserCards userInfo={userInfo} editor setCardsInfo={setCardsInfo} cardsInfo={cardsInfo} />,
        },
        Templates: {
          title: "Templates",
          icon: <Table />,
          content: <Temp />,
        },
      }
    : {};

  const [current, setCurrent] = useState<JSX.Element | undefined>();

  async function LoadUser() {
    setLoading(true);
    const userData = await GetUserSession();
    if (!userData) return;

    const response = await fetch(`/api/v1/cards/${userData.username}`);
    if (response.ok) {
      const cardsData = await response.json();
      setCardsInfo(cardsData);
    }

    setUserInfo(userData);
    setLoading(false);
  }

  useEffect(() => {
    LoadUser();
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-linear-to-tr from-transparent via-transparent to-blue-950/30">
      <MovingParticles />
      <Navigation userInfo={userInfo} />

      <div className="grid grid-cols-[250px_1fr] grow">
        <div className="w-full h-full bg-linear-to-b  from-gray-900/40 to-gray-900/10 backdrop-blur-lg rounded-tr-3xl p-4 border-1 border-l-0 border-b-0">
          <div className="flex flex-row gap-2 p-4 items-center text-2xl">
            <img
              src="/moon_icon.png"
              draggable={false}
              className="mt-auto mb-auto w-[30px] h-[30px]"
              loading="lazy"
              alt="icon"
            />
            Vivre Cards
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem
              value={"1"}
              className="bg-gray-950/50 backdrop-blur-lg overflow-hidden rounded-xl mb-4"
            >
              <AccordionTrigger className="hover:no-underline px-4 bg-gray-900/50 rounded-none cursor-pointer">
                <div className="flex flex-row gap-2 items-center">
                  <UserCog /> Account
                </div>
              </AccordionTrigger>

              {Object.keys(accordionViews).map((item) => (
                <AccordionContent
                  key={item}
                  onClick={() => setCurrent(accordionViews[item])}
                  className="px-4 py-2 hover:bg-gray-800 cursor-pointer duration-200"
                >
                  {item}
                </AccordionContent>
              ))}
            </AccordionItem>
          </Accordion>
          {Object.keys(views).map((item) => {
            if (views[item].requiresCards && !cardsInfo) return null;
            return (
              <Button
                key={item + "-button"}
                onClick={() => setCurrent(views[item].content)}
                className="mb-4 w-full bg-gray-900/70 cursor-pointer rounded-xl justify-start hover:bg-gray-900 gap-2"
              >
                {views[item].icon} {views[item].title}
              </Button>
            );
          })}
        </div>
        <div className="p-8 flex justify-center">
          <div className="w-full h-full max-w-[1300px]">
            {userInfo && (current || <Overview userInfo={userInfo} />)}
          </div>
        </div>
      </div>
      <Toaster theme="dark" />
    </div>
  );
}

export default PortfolioPage;
