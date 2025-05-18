import { Bug, Cat, Clock, Heart, Sparkles } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ProfileBadges from "./ProfileBadges";
import LinkRenderer from "../ui/link-renderer";
import { Separator } from "@radix-ui/react-separator";
import { format } from "date-fns";
import { CardsInfo, CardsTab } from "~/models/Cards";
import TabsTopBar from "../pages/CardsEdit/Tabs/TabsTopBar";

function UserCards({
  data,
  includeBanner = false,
  bordered = false,
  tabs,
  selectedTab,
  setSelectedTabIndex,
  setTabs
}: {
  data: CardsInfo;
  includeBanner?: boolean;
  absolute?: boolean;
  bordered?: boolean;
  tabs: CardsTab[];
  selectedTab: CardsTab | null;
  setSelectedTabIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setTabs: React.Dispatch<React.SetStateAction<CardsTab[]>>;
}) {
  const {
    username,
    banner,
    about,
    displayName,
    createdAt,
    updated,
    avatar,
    links,
    showTimestamps,
  } = data;

  return (
    <>
      {includeBanner && banner && (
        <>
          <img
            className="w-full h-full object-cover absolute z-[-1] top-0 left-0"
            src={banner}
            alt=""
          />
          <div className="w-full h-full bg-gradient-to-t via-transparent from-black absolute z-[-1] top-0 left-0"></div>
        </>
      )}
      <CardContainer
        className="inter-var"
        containerClassName="h-full absolute inset-0"
      >
        <CardBody className="w-[720px] flex flex-col">
          <TabsTopBar
            tabs={tabs}
            selectedTab={selectedTab}
            setSelectedTabIndex={setSelectedTabIndex}
            setTabs={setTabs}
            bordered={bordered}
          />
          <div
            className="grow w-full p-4 flex flex-col gap-4 relative group/card rounded-2xl"
          >
            <div className={
              "absolute inset-0 bg-gray-950/20 backdrop-blur-lg rounded-2xl rounded-tl-none "+
              (bordered ? "border border-gray-800" : "")
              }></div>
            {/* Header Section */}
            <div
              className={`grid grid-cols-[auto_1fr] gap-x-4 ${
                about ? "items-start" : "items-center"
              }`}
            >
              <CardItem
                translateZ={40}
                className="row-span-2 self-start select-none"
              >
                <Avatar className="relative h-32 w-32 rounded-full overflow-hidden">
                  <AvatarImage src={avatar} alt={`@${username}`} />
                  <AvatarFallback>{displayName}</AvatarFallback>
                </Avatar>
              </CardItem>

              <CardItem translateZ={30} className="col-start-2 row-start-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-4xl font-bold">{displayName}</h2>
                  <ProfileBadges profileInfo={data} />
                </div>
              </CardItem>

              {about && (
                <CardItem translateZ={20} className="col-start-2 row-start-2">
                  <div className="space-y-2">
                    <p className="*:text-xl leading-relaxed whitespace-pre-line">
                      {about}
                    </p>
                  </div>
                </CardItem>
              )}
            </div>
            {
              //Concept showcase will be replaced soon with actual shit
              data.userid == "96127444" && (
                <div className="w-full justify-stretch grid grid-cols-3 h-25 gap-2 select-none">
                  <CardItem
                    translateZ={50}
                    rotateY={-20}
                    className="bg-pink-800/30 w-full rounded flex justify-center flex-col items-center"
                  >
                    <div className="font-mono text-4xl flex flex-row items-center gap-2 text-pink-600">
                      <Bug size={55} />
                      <span className="font-extrabold">Zero</span>
                    </div>
                    <div className="font-mono text-2xl flex flex-row items-center gap-2 text-fuchsia-400">
                      Critical Bugs
                    </div>
                  </CardItem>
                  <CardItem
                    translateZ={100}
                    className="bg-emerald-700/20 w-full rounded flex justify-center flex-col items-center"
                  >
                    <div className="font-mono text-2xl flex flex-row items-center gap-2 text-emerald-400">
                      <Sparkles size={55} />
                      <span className="w-min font-extrabold">High Quality</span>
                    </div>
                    <div className="font-mono text-lg flex flex-row items-center gap-2 text-sky-400">
                      Clean and Pretty
                    </div>
                  </CardItem>
                  <CardItem
                    translateZ={50}
                    rotateY={20}
                    className="bg-blue-700/20 w-full rounded flex justify-center flex-col items-center"
                  >
                    <div className="font-mono text-4xl flex flex-row items-center gap-2 text-blue-400 ">
                      <Cat size={55} />
                      <span className="w-min font-extrabold">Cat?</span>
                    </div>
                    <div className="font-mono text-lg flex flex-row items-center gap-2 text-purple-400">
                      i love cats <Heart size={20} />
                    </div>
                  </CardItem>
                </div>
              )
            }

            {/* Links Section */}
            {links.length > 0 && (
              <CardItem translateZ={20} className="w-full space-y-2 mt-auto">
                {/* <div className="flex items-center gap-2 text-gray-600">
              <Link2 className="h-4 w-4" />
              <span className="text-sm font-medium">Links</span>
            </div> */}
                <div className="flex flex-wrap gap-3 justify-center">
                  {links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 p-1"
                    >
                      <LinkRenderer link={link} tooltip />
                    </a>
                  ))}
                </div>
              </CardItem>
            )}

            {/* Footer Timestamps */}
            {showTimestamps && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <Clock className="h-4 w-4" />
                    <span>
                      Created: {format(createdAt, "MMM dd, yyyy")} • Last
                      updated: {format(updated, "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </CardContainer>
    </>
  );
}

export default UserCards;
