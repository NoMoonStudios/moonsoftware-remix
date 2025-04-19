import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import Navigation from "~/components/pages/Navigation"
import { Skeleton } from "~/components/ui/skeleton";
import { GetUserSession } from "~/lib/Utilities/client";
import { PortfolioInfo } from "~/models/Portfolio";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { UserInfo } from "~/types/init";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import LinkRenderer from "~/components/ui/link-renderer";

function PortfolioCard({data}: {data: PortfolioInfo}) {
  const { username, about, displayName, createdAt, updated, avatar, links, showTimestamps } = data; 
  
  return (
    <Card className="w-full max-w-2xl p-4 flex flex-col gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
      {/* Header Section */}
      <div className={`flex gap-4 ${about ? "items-start" : "items-center"}`}>
        <Avatar className="relative h-32 w-32 rounded-full overflow-hidden">
          <AvatarImage src={avatar} alt={`@${username}`} />
          <AvatarFallback>{displayName}</AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col grow">
          <h2 className="text-4xl font-bold">{displayName}</h2>
          {about && (
            <div className="space-y-2">
              <p className="*:text-xl leading-relaxed whitespace-pre-line">{about}</p>
            </div>
          )}
        </div>
      </div>


      {/* Links Section */}
      {links.length > 0 && (
        <div className="space-y-2">
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
        </div>
      )}

      {/* Footer Timestamps */}
      { showTimestamps && <>
        <Separator />
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>
              Created: {format(createdAt, 'MMM dd, yyyy')} • 
              Last updated: {format(updated, 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
      </>
      }
    </Card>
  )
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
  )
}


const Profile = () => {
  const [userInfo, setUserInfo] = useState<UserInfo|undefined>();
  const [portfolioInfo, SetPorfolioInfo] = useState<PortfolioInfo|undefined>();
  const [notFound, setNotFound] = useState(false)
  const params = useParams();
  useEffect(() => {
    const fetchData = async () => {
      GetUserSession().then((data) => {
        if (!data) return;
        setUserInfo(data);
      })
      try {
        const response = await fetch(`/api/v1/portfolio/${params.username}`);
        
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
        console.error('Fetch error:', error);
        setNotFound(true);
      }
    };
    fetchData();

  }, [params])

  if (notFound) {
    return (
      <div className="h-screen flex justify-center text-center">
        <div className="flex flex-col mt-auto mb-auto gap-4 justify-center items-center">
          <h1 className="font-bold text-7xl">
            404
          </h1>
          <p>Not Found</p>
          <p>Error: No user found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-x-hidden flex flex-col">
      <Navigation userInfo={userInfo}/>
      { portfolioInfo ? 
        <>
          {!portfolioInfo.enabled && <Tooltip >
            <TooltipContent>
                Your Card is disabled in settings, you can enable it there

            </TooltipContent>
            <TooltipTrigger asChild>
              <p className="opacity-50 flex flex-row gap-2 absolute bottom-5 left-5 select-none">
                <AlertCircle/> Only you can see your Card
              </p>
            </TooltipTrigger>
          </Tooltip>
            }
          <PortfolioCard data={portfolioInfo} />
        </> : 
        <SkeletonProfile />
      }
    </div>
  )
}

export default Profile