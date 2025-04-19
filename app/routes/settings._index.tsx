import { SettingsIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { toast, Toaster } from "sonner";
import Navigation from "~/components/pages/Navigation"
import Portfolio from "~/components/pages/Settings/Portfolio";
import Profile from "~/components/pages/Settings/Profile";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { GetUserSession } from "~/lib/Utilities/client";
import { UserInfo } from "~/types/init";

const Temp = ({userInfo}: {userInfo: UserInfo}) => {
  const isMula = userInfo?.userid == '81801176'
  const isCato = userInfo?.userid == '96127444'
  
  useEffect(() => {
    if (isMula) {
      Promise.resolve().then(() => {
        toast.warning("Fuck off mula this shit ain't ready yet");
      });
    }
  }, [])

  if (!userInfo) return <div className="flex justify-center items-center w-full h-full text-3xl text-gray-600">Unavailable</div>;
  if (!isMula && !isCato) return <div className="flex justify-center items-center w-full h-full text-3xl text-gray-600">Unavailable</div>;
  return <Portfolio userInfo={userInfo}/>
}
const Settings = () => {
  const [userInfo, setUserInfo] = useState<UserInfo|undefined>();
  const [selected, setSelected] = useState("Profile")
  const [loading, setLoading] = useState(false)

  async function LoadUser(){
    setLoading(true);
    const data = await GetUserSession()
    if (!data) return;
    
    setUserInfo(data);
    setLoading(false);
  }
  
  const buttonStyle = "h-12 cursor-pointer duration-200 rounded-none border-l-4 hover:border-white hover:bg-transparent"
  
  const items = userInfo ? {
    Profile: <Profile userInfo={userInfo} onUpdate={LoadUser}/>,
    Portfolio: <Temp userInfo={userInfo}/>,
    Account: <div className="flex justify-center items-center w-full h-full text-3xl text-gray-600">Coming Soon</div>,
    Commisions: <div className="flex justify-center items-center w-full h-full text-3xl text-gray-600">Coming Soon</div>,
    Billing: <div className="flex justify-center items-center w-full h-full text-3xl text-gray-600">Coming Soon</div>,
    Privacy: <div className="flex justify-center items-center w-full h-full text-3xl text-gray-600">Coming Soon</div>,
  } : {}
  
  useEffect(() => {
    LoadUser()
  }, [])
  


  return (
    <div className="w-full h-screen flex flex-col">
      <Navigation userInfo={userInfo}/>
      <div className="w-full flex grow justify-center mt-10 mb-10">
        <div className="w-full max-w-[1600px] flex flex-row min-h-80">
          <div className="w-[250px] flex flex-col pr-5 pl-5">
            <div className="w-full h-12 flex flex-row justify-center items-center gap-2 mb-3 mt-3 text-xl">
              <SettingsIcon/> Settings
            </div>
            <Separator className="w-full"/>
            { Object.keys(items).map((item) => (<Button key={item+"-button"} variant={"ghost"} className={buttonStyle+(selected != item && " border-transparent")} onClick={() => setSelected(item)}>{item}</Button>)) }
          </div>
          
          <div className="w-full flex flex-col relative border rounded-lg overflow-hidden bg-gray-950 mr-5">
            <AnimatePresence >
              <div key="title-container" className="w-full h-12 flex flex-row items-center p-8">
                { userInfo && selected && 
                  <motion.h1 
                  key={selected+"-header"} 
                  initial={{opacity: 0, x: -20}} 
                  animate={{opacity: 1, x: 0}} 
                  exit={{
                    opacity: 0, 
                    x: 10,
                  }}
                  layout="position" 
                  className="font-bold text-3xl">
                    {selected}
                  </motion.h1> 
                }

                {loading && <CgSpinner className="animate-spin ml-auto" size={25}/>}
              </div>
              <Separator key="main-separator" className="w-full"/>
              { userInfo && selected &&
                <div key="content-container" className="w-full grow flex relative overflow-y-auto">
                <motion.div 
                  key={selected} 
                  initial={{opacity: 0}}
                  animate={{
                    opacity: 1, 
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  layout="position" 
                  className="w-full grow p-8"
                  >

                  { items[selected as keyof typeof items] }
                </motion.div>
                </div>
              }
            </AnimatePresence>
          </div>

          <Toaster theme="dark" />
        </div>
      </div>
    </div>
  )
}

export default Settings