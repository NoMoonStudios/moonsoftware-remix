import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import Navigation from "~/components/pages/Navigation";
import { Skeleton } from "~/components/ui/skeleton";
import { GetUserSession } from "~/lib/Utilities/client";
import { CardsInfo } from "~/models/Cards";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { AlertCircle, Bug, Cat, Clock, Heart, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { UserInfo } from "~/types/init";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import LinkRenderer from "~/components/ui/link-renderer";
import ProfileBadges from "~/components/ui/profile-badges";
import { CardBody, CardContainer, CardItem } from "~/components/ui/3d-card";

function PortfolioCard({ data }: { data: CardsInfo }) {
  const {
    username,
    about,
    displayName,
    createdAt,
    updated,
    avatar,
    links,
    showTimestamps,
  } = data;

  return (
    <CardContainer
      className="inter-var"
      containerClassName="h-full absolute inset-0"
    >
      <CardBody className="w-2xl p-4 flex flex-col gap-4 relative group/card">
        <div className="absolute inset-0 bg-gray-950/20 backdrop-blur-lg rounded-2xl"></div>
        {/* Header Section */}
        <div
          className={`grid grid-cols-[auto_1fr] gap-x-4 ${
            about ? "items-start" : "items-center"
          }`}
        >
          <CardItem translateZ={40} className="row-span-2 self-start select-none">
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
          data.userid == '96127444' &&
          <div className="w-full justify-stretch grid grid-cols-3 h-25 gap-2 select-none">
            <CardItem translateZ={50} rotateY={-20} className="bg-pink-800/30 w-full rounded flex justify-center flex-col items-center" >
              <div className="font-mono text-4xl flex flex-row items-center gap-2 text-pink-600"> 
                <Bug size={55}/>
                <span className="font-extrabold">
                  Zero
                </span>
              </div>
              <div className="font-mono text-2xl flex flex-row items-center gap-2 text-fuchsia-400">
                Critical Bugs
              </div>
            </CardItem>
            <CardItem translateZ={100} className="bg-emerald-700/20 w-full rounded flex justify-center flex-col items-center" >
              <div className="font-mono text-2xl flex flex-row items-center gap-2 text-emerald-400"> 
                <Sparkles size={55}/>
                <span className="w-min font-extrabold">
                  High Quality
                </span>
              </div>
              <div className="font-mono text-lg flex flex-row items-center gap-2 text-sky-400">
                Clean and Pretty
              </div>
            </CardItem>
            <CardItem translateZ={50} rotateY={20} className="bg-blue-700/20 w-full rounded flex justify-center flex-col items-center" >
              <div className="font-mono text-4xl flex flex-row items-center gap-2 text-blue-400 "> 
                <Cat size={55}/>
                <span className="w-min font-extrabold">
                  Cat?
                </span>
              </div>
              <div className="font-mono text-lg flex flex-row items-center gap-2 text-purple-400">
                i love cats <Heart size={20}/>
              </div>
            </CardItem>
          </div>
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
                  Created: {format(createdAt, "MMM dd, yyyy")} • Last updated:{" "}
                  {format(updated, "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </>
        )}
      </CardBody>
    </CardContainer>
  );
}

const SkeletonProfile = () => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-row gap-4 w-xl mt-20">
        <Skeleton className="w-35 h-35 rounded-full" />
        <div className="flex flex-col gap-4 justify-center">
          <Skeleton className="w-60 h-10" />
          <Skeleton className="w-40 h-8" />
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
  const [CardsInfo, SetPorfolioInfo] = useState<
    CardsInfo | undefined
  >();
  const [notFound, setNotFound] = useState(false);
  const params = useParams();
  useEffect(() => {
    const fetchData = async () => {
      GetUserSession().then((data) => {
        if (!data) return;
        setUserInfo(data);
      });
      try {
        const response = await fetch(`/api/v1/cards/${params.username}`);

        if (response.status === 404) {
          setNotFound(true);
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (!data) setNotFound(true);
        SetPorfolioInfo(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setNotFound(true);
      }
    };
    fetchData();
  }, [params]);

  if (notFound) {
    return (
      <div className="h-screen flex justify-center text-center">
        <div className="flex flex-col mt-auto mb-auto gap-4 justify-center items-center">
          <h1 className="font-bold text-7xl">404</h1>
          <p>Not Found</p>
          <p>Error: No user found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-x-hidden flex flex-col">
      <Navigation userInfo={userInfo} />
      {CardsInfo ? (
        <>
          <p className="absolute font-mono text-lg bottom-20 left-5 text-white/50">
            EXPERIMENTAL
          </p>
          <p className="absolute font-mono text-sm bottom-15 left-5 text-white/50">
            Early Work in Progress{" "}
            <span className="text-xs text-white/30">Subject to Change</span>
          </p>
          {!CardsInfo.enabled && (
            <Tooltip>
              <TooltipContent>
                Your Card is disabled in settings, you can enable it there
              </TooltipContent>
              <TooltipTrigger asChild>
                <p className="opacity-50 flex flex-row gap-2 absolute bottom-5 left-5 select-none">
                  <AlertCircle /> Only you can see your Card
                </p>
              </TooltipTrigger>
            </Tooltip>
          )}
          {CardsInfo.banner && (
            <>
              <img
                className="w-full h-full object-cover absolute z-[-1] top-0 left-0"
                src={CardsInfo.banner}
                alt=""
              />
              <div className="w-full h-full bg-gradient-to-t via-transparent from-black absolute z-[-1] top-0 left-0"></div>
            </>
          )}
          <PortfolioCard data={CardsInfo} />
        </>
      ) : (
        <SkeletonProfile />
      )}
    </div>
  );
};

export default Profile;
