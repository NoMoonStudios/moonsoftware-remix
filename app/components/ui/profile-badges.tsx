import badges, { BadgeInfo } from "~/lib/Modules/Badges";
import { UserInfo } from "~/types/init"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const BadgeWrapper = ({badge}: {badge: BadgeInfo}) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="relative">
          <div className="relative w-7 h-7 p-1 flex items-center justify-center duration-100 rounded hover:bg-gray-950/50 cursor-pointer">
            {badge.badge}
            {badge.glow && <div 
              className={'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-radial opacity-50 to-transparent via-transparent'} 
              style={{'--tw-gradient-from': badge.glowColor || "#fff"} as React.CSSProperties}
            />}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent className={badge.className} arrowClassName={badge.arrowClassName}>
        {
          badge.element ? 
          badge.element : 
          <div className="flex flex-col gap-1 text-center">
          <span className="text-sm">{badge.name}</span>
          {badge.description && <p className="opacity-50 text-xs">{badge.description}</p>}
          </div>
        }
      </TooltipContent>
    </Tooltip>
  )
}
const ProfileBadges = ({profileInfo, className}: {profileInfo: UserInfo, className?: string}) => {
  return (
    (profileInfo.isVerified || profileInfo.badges.length > 0) &&
    <div className={"flex flex-row " + className}>
      {profileInfo.isVerified && <BadgeWrapper badge={badges[1]} />}
      {profileInfo.badges
        .filter((badge) => badges[badge])
        .sort((a, b) => a - b)
        .map((badge) => <BadgeWrapper key={badge} badge={badges[badge]} />)}
    </div>
  )
}

export default ProfileBadges
