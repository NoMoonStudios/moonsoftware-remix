import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import Navigation from "~/components/pages/Navigation"
import { Button } from "~/components/ui/button";
import { GetUserSession } from "~/lib/Utilities/client";

const Feature = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex gap-2">
      <Check/>
      {children}
    </div>
  )
}

function PortfolioPage() {
  const [userInfo, setUserInfo] = useState<UserInfo|undefined>();
  const [loading, setLoading] = useState(false)

  async function LoadUser(){
    setLoading(true);
    const data = await GetUserSession()
    if (!data) return;
    
    setUserInfo(data);
    setLoading(false);
  }

  useEffect(() => {
    LoadUser()
  }, [])
    

  return (
    <div className="flex flex-col h-full w-full">
      <Navigation userInfo={userInfo}/>
      <div className="flex justify-center items-center flex-col w-full h-full gap-2">
        <h1 className="text-6xl">Pricing</h1>
        {/* <p className="max-w-lg text-center">Use MoonSoftware Cards to elevate your business Cards to the next level</p> */}
        <div className="mt-8 flex flex-row gap-4">
          <div className="flex flex-col gap-2 border-1 rounded-2xl w-[300px] h-[400px] p-8">
            <h1 className="text-3xl">
              Free
            </h1>
            <p className="opacity-50">Use MoonSoftware Cards for free to elevate your business Cards to the next level</p>
            <Feature>Brokie</Feature>
            <Button className="mt-auto" onClick={() => {
              fetch("/api/v1/cards/create", { method: "POST" });
            }}>Get Started</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioPage