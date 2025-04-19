import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import Navigation from "~/components/pages/Navigation"
import { Skeleton } from "~/components/ui/skeleton";
import { GetUserSession } from "~/lib/Utilities/client";
import { UserInfo } from "~/types/init";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { darkenHexColor } from "~/lib/Utilities/ClientFunctions/Color";
import ProfileBadges from "~/components/ui/profile-badges";
import { Pill } from "lucide-react";



const ProfileOverview = ({profileInfo}: {profileInfo: UserInfo}) => {
  return <div className="flex flex-col gap-4 w-[250px] ">
    <Avatar className="w-35 h-35">
        <AvatarImage src={profileInfo.avatar} alt={`@${profileInfo.username}`} />
        <AvatarFallback>{profileInfo.username}</AvatarFallback>
    </Avatar>
    <div className="flex flex-col justify-center gap-2">
      <div>
        <div className="flex flex-row gap-2 items-center flex-wrap">
          <h1 className="font-bold text-3xl">
            {profileInfo.displayName}
          </h1>
          {profileInfo.customBadge && <Badge 
            className="border-current backdrop-blur-md"
            style={{ 
              color: profileInfo.customBadge.color || '#fff',
              background: darkenHexColor(profileInfo.customBadge.color, 2000)+80
            }}>
              {profileInfo.customBadge.name}
            </Badge>}
        </div>

        <h1 className="opacity-50 text-lg flex flex-row items-center gap-2">
            {profileInfo.username} {profileInfo.pronouns && <><div className="inline-block w-1 h-1 rounded-full bg-white"/>{profileInfo.pronouns}</>} 
        </h1>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <ProfileBadges profileInfo={profileInfo} className="bg-gray-950/50 backdrop-blur-lg rounded "/>
      </div>
      { profileInfo.bio &&
        <div className="flex flex-col gap-2 p-3 bg-gray-950/50 backdrop-blur-lg rounded text-gray-200">
          <div className="flex flex-row gap-2 items-center text-gray-400">
            <p className="font-bold text-sm">About Me</p> 
            <Badge variant="secondary">Beta</Badge>
          </div>
        <p className="whitespace-pre-line">{profileInfo.bio}</p>
      </div>
      }
      <Button variant={"outline"} className="cursor-pointer bg-gray-950/50 backdrop-blur-lg">
        Contact
      </Button>
    </div>
  </div>
}
const ProfilePage = ({profileInfo}: {profileInfo: UserInfo}) => {
  const [selected, setSelected] = useState("Assets")
  const items = {
    "Assets": "Assets", 
    "Games": "Games",
    "History": "History", 
  }
  const buttonStyle = "h-12 cursor-pointer duration-200 rounded-none border-b-4 hover:border-white hover:bg-transparent"
  
  return (
    <div className="flex flex-row gap-4 w-full max-w-7xl my-20 grow">
      { profileInfo.banner &&
        <>
          <img 
            className="w-full h-full object-cover absolute z-[-1] top-0 left-0"
            src={profileInfo.banner} 
            alt=""
          />
          <div className="w-full h-full bg-gradient-to-t from-gray-950 absolute z-[-1] top-0 left-0"></div>
        </>
      }
      <ProfileOverview profileInfo={profileInfo}/>
      <div className="flex flex-col gap-2 grow">
        <div className="flex flex-row bg-gray-950/50 backdrop-blur-lg rounded items-center text-3xl font-bold">
            { Object.keys(items).map((item) => (<Button key={item+"-button"} variant={"ghost"} className={buttonStyle+(selected != item && " border-transparent")} onClick={() => setSelected(item)}>{item}</Button>)) }
        </div>
        <div className="flex flex-col bg-gray-950/50 backdrop-blur-lg rounded grow justify-center items-center text-3xl text-gray-700 font-bold">
            Work In Progress
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
  const [profileInfo, setProfileInfo] = useState<UserInfo|undefined>();
  const [error, setError] = useState(false)
  const [errorCode, setErrorCode] = useState(0)
  const [errorText, setErrorText] = useState("")
  const params = useParams();
  useEffect(() => {
    const fetchData = async () => {
      GetUserSession().then((data) => {
        if (!data) return;
        setUserInfo(data);
      })
      try {
        const response = await fetch(`/api/v1/users/${params.username}`);
        
        if (response.status === 404) {
          setError(true);
          return;
        }
        if (!response.ok) {
          setErrorCode(response.status)
          setErrorText(response.statusText)
          throw new Error(response.statusText);
        }
        const data = await response.json();
        if (!data) setError(true);
        setProfileInfo(data);
      } catch (error) {
        console.error(error)
        setError(true);
      }
    };
    fetchData();

  }, [params])

  if (error) {
    return (
      <div className="h-screen flex justify-center text-center ">
        <div className="flex flex-col mt-auto mb-auto gap-4 justify-center items-center">
          <h1 className="font-bold text-7xl">
            Error {errorCode}
          </h1>
          <p>{errorText}</p>
          <p className="opacity-50 italic flex flex-row gap-2">{errorCode === 429 && <><Pill className="animate-spin duration-2000"/> Take a chill pill</>}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col items-center overflow-x-hidden">
      <Navigation userInfo={userInfo}/>
      { profileInfo ? 
        <ProfilePage profileInfo={profileInfo} /> : 
        <SkeletonProfile />
      }
    </div>
  )
}

export default Profile