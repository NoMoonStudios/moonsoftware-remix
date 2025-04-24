import { Braces, Bug, Shield, ShieldCheck, Verified } from "lucide-react"


export type BadgeInfo = {
  name: string
  badge: React.ReactNode
  description?: string
  glow?: boolean
  glowColor?: string
  element?: JSX.Element
  className?: string
  arrowClassName?: string
}
const badges: {[key: number]: BadgeInfo} = {
  0: {
    name: "Cato",
    className: "border-1 border-gray-700 bg-linear-to-t to-amber-800 from-black fill-black",
    arrowClassName: "fill-black bg-black",
    glow: true,
    element: <div className="w-40 h-60 flex items-center flex-col select-none">
      <img src="/badges/cato.badge.png" alt="Cato" className="w-40 h-40" />
      <span className="text-xl font-bold italic tracking-widest leading-4 text-amber-400">Divine</span>
      <span className="text-2xl font-extrabold italic tracking-widest">Cat</span>
      <p className="opacity-50 text-s mt-auto mb-2">The Most Supreme Cat</p>
    </div>,
    badge: <img src="/badges/cato.png" alt="Cato" />
  },
  1: {
    name: "Verified",
    description: "Verified User by Moon Software",
    glow: true,
    glowColor: "#00c3ff",
    badge: <Verified className="text-sky-400" />,
    className: "border-1 border-gray-700",
    element:<div className="w-25 h-25 flex items-center flex-col select-none">
    <Verified className="w-10 h-10 mt-auto mb-auto" />
      
      <span className="text-md font-bold leading-4">Verified</span>
      <p className="opacity-50 text-s mt-auto mb-1 text-center">Verified by Moon Software</p>
    </div>,
  },
  2: {
    name: "Admin",
    glow: true,
    glowColor: "#ff0000",
    badge: <ShieldCheck className="text-red-600" />,
    description: "Moon Software Administrator"
  },
  3: {
    name: "Developer",
    badge: <Braces className="text-green-500" />,
    description: "Verified Developer"
  },
  4: {
    name: "Staff",
    badge: <Shield className="text-orange-500" />,
    description: "Verified Moon Software Staff"
  },
  5: {
    name: "RobloxDevs Staff",
    badge: <img src="/badges/rd.png" alt="RD" />,
    description: "Verified RobloxDevelopers Staff"
  },
  6: {
    name: "Server Booster",
    badge: <img src="/badges/booster.png" alt="SB" />,
    description: "Moon Software/Sithis Server Booster",
    glow: true,
    glowColor: "#cc00ff",
  },
  7: {
    name: "DevSec Staff",
    badge: <img src="/badges/devsec.png" alt="DevSec" />,
    description: "Verified DevSec Staff"
  },
  8: {
    name: "Scam Investigator",
    badge: <img src="/badges/scaminvestigator.png" alt="SI" />,
    description: "Verified Scam Investigator"
  },
  9: {
    name: "RD Moderator",
    badge: <img src="/badges/rdmod.png" alt="SOD" />,
    description: "RobloxDevelopers Moderator"
  },
  10: {
    name: "Beta Tester",
    badge: <Bug className="text-red-500" />,
    description: "Tested the website in its Early Stages"
  },
  11: {
    name: "SOD Staff",
    badge: <img src="/badges/sod.webp" alt="SOD" />,
    description: "Verified School of Developers Staff"
  },
  12: {
    name: "DEVNET Staff",
    badge: <img src="/badges/DNL.png" alt="DN" />,
    description: "Verified DEVNET Staff"
  },
  13: {
    name: "DevCentral Staff",
    badge: <img src="/badges/dc.png" alt="DC" />,
    description: "Verified DevCentral Staff"
  },
}

export default badges
