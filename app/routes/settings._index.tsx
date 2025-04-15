import { SettingsIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CgPaypal } from "react-icons/cg";
import Navigation from "~/components/pages/Navigation"
import Portfolio from "~/components/pages/Settings/Portfolio";
import Profile from "~/components/pages/Settings/Profile";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { GetUserSession } from "~/lib/Utilities/client";
import { UserInfo } from "~/types/init";


const Settings = () => {
  const [userInfo, setUserInfo] = useState<UserInfo|undefined>();
  const [selected, setSelected] = useState("Profile")

  async function LoadUser(){
    const data = await GetUserSession()
    if (!data) return;
    
    setUserInfo(data);
  }
  
  const buttonStyle = "h-12 cursor-pointer duration-200 rounded-none border-l-4 hover:border-white hover:bg-transparent"
  
  const items = userInfo ? {
    Profile: <Profile userInfo={userInfo} onUpdate={LoadUser}/>,
    Portfolio: <Portfolio userInfo={userInfo}/>,
    Account: <h1 className="text-2xl font-bold">wow didnt do</h1>,
    Commisions: <>or this</>,
    Billing: <>im too lazy</>,
    Privacy: <div className="flex flex-col h-full">
      anyways total cost will be:
      <div className="text-green-500 text-2xl">$4,499.99 <span className="text-white text-sm opacity-35">Taxes not included</span></div>
      <Separator className="w-full mt-4 mb-8"/>
      <Button className="cursor-pointer w-min"><CgPaypal/> Pay Via PayPal</Button>
      <p className="text-red-700 text-sm mt-4">(failure to pay will result in heavy consequences)</p>
      <div className="grow"></div>
      <Button variant={"outline"} className="cursor-pointer mt-auto w-min">Commit Suicide</Button>
    </div>,
  } : {}
  
  useEffect(() => {
    LoadUser()
  }, [])
  


  return (
    <div className="w-full h-full flex flex-col">
      <Navigation userInfo={userInfo}/>
      <div className="w-full flex grow justify-center mt-10 mb-10">
        <div className="w-7xl flex flex-row min-h-80">
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
              </div>
              <Separator key="main-separator" className="w-full"/>
              { userInfo && selected &&
                <div key="content-container" className="w-full grow flex relative">

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
        </div>
      </div>
    </div>
  )
}

export default Settings