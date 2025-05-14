import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import Navigation from "~/components/pages/Navigation";
import { Skeleton } from "~/components/ui/skeleton";
import { GetUserSession } from "~/lib/Utilities/client";
import { CardsInfo } from "~/models/Cards";
import { AlertCircle } from "lucide-react";
import { UserInfo } from "~/types/init";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import ProfileCards from "~/components/features/UserCards";

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
  const [CardsInfo, SetPorfolioInfo] = useState<CardsInfo | undefined>();
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

          <ProfileCards data={CardsInfo} includeBanner />
        </>
      ) : (
        <SkeletonProfile />
      )}
    </div>
  );
};

export default Profile;
