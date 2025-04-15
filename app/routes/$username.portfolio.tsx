import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import Navigation from "~/components/pages/Navigation"
import { Skeleton } from "~/components/ui/skeleton";
import { GetUserSession } from "~/lib/Utilities/client";
import { Portfolio } from "~/models/Portfolio";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"

const ProfilePage = ({portfolioInfo}: {portfolioInfo: Portfolio}) => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-row gap-4 w-xl mt-20">
      <Avatar className="w-35 h-35">
          <AvatarImage src={portfolioInfo.avatar} alt={`@${portfolioInfo.username}`} />
          <AvatarFallback>{portfolioInfo.username}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center">
        <h1 className="font-bold text-5xl">
            {portfolioInfo.username}
        </h1>
        <h1 className="opacity-50 text-lg">
            @{portfolioInfo.username}
        </h1>
      </div>
      </div>
    </div>
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
  const [portfolioInfo, SetPorfolioInfo] = useState<UserInfo|undefined>();
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
        console.log(data);
        
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
    <div className="h-screen overflow-x-hidden">
      <Navigation userInfo={userInfo}/>
      { portfolioInfo ? 
        <ProfilePage portfolioInfo={portfolioInfo} /> : 
        <SkeletonProfile />
      }
    </div>
  )
}

export default Profile