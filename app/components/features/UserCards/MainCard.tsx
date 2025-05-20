import { CardBody, CardContainer, CardItem } from '~/components/ui/3d-card';
import TabSelector from './Components/TabSelector';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import ProfileBadges from '../ProfileBadges';
import { Bug, Cat, Clock, Heart, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@radix-ui/react-separator';
import LinkRenderer from '~/components/ui/link-renderer';
import { CardsInfo, CardsTab } from '~/models/Cards';

function MainCard({
  cardsInfo,
  editor = false,
  includeBanner = false,
  selectedTab = null,
  setTabs,
  setSelectedTabIndex,
  bordered = false,
}: {
  cardsInfo: CardsInfo;
  editor?: boolean;
  includeBanner?: boolean;
  bordered?: boolean;
  selectedTab?: CardsTab | null;
  setSelectedTabIndex?: React.Dispatch<React.SetStateAction<number | null>>;
  setTabs: (tabs: CardsTab[]) => void;
}) {
  const { about, banner, avatar, links, tabs, displayName, showTimestamps, updated, createdAt, username } = cardsInfo;
  
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
      <CardContainer>
        <CardBody className="w-[720px] flex flex-col h-full">
          { tabs && setTabs && setSelectedTabIndex && <TabSelector
            editor={editor}
            tabs={tabs}
            selectedTab={selectedTab}
            setSelectedTabIndex={setSelectedTabIndex}
            setTabs={setTabs}
            bordered={bordered}
          />}
          <div
            className="grow w-full p-4 flex flex-col gap-4 relative group/card rounded-2xl min-h-100"
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
                <Avatar className="relative h-32 w-32 rounded-full block overflow-hidden">
                  <AvatarImage src={avatar} alt={`@${username}`} />
                  <AvatarFallback>{displayName}</AvatarFallback>
                </Avatar>
              </CardItem>

              <CardItem translateZ={30} className="col-start-2 row-start-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-4xl font-bold">{displayName}</h2>
                  <ProfileBadges profileInfo={cardsInfo} />
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
              <CardItem
                translateZ={10}
              >
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
            </CardItem>
            )}
          </div>
        </CardBody>
      </CardContainer>
    </>
  );
}

export default MainCard