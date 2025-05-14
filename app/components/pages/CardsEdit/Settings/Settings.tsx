import { UserInfo } from "~/types/init"
import Profile from "../../Settings/Profile"
import { Card } from "~/components/ui/card"

const Settings = ({userInfo}: {userInfo: UserInfo}) => {
  return (
    <div className="flex flex-col gap-4 w-full justify-center items-center">
      <h1 className="text-3xl">Profile Settings</h1>
      <Card className="w-[600px] p-8 bg-gray-950/50 backdrop-blur-lg">
        <Profile userInfo={userInfo} dashboard />
      </Card>
    </div>
  )
}

export default Settings