import { Braces, Shield, ShieldCheck, Verified } from "lucide-react"


export type BadgeInfo = {
  name: string
  glow?: boolean
  glowColor?: string
  badge: React.ReactNode
}
const badges: {[key: number]: BadgeInfo} = {
  1: {
    name: "Verified",
    glow: true,
    glowColor: "#00c3ff",
    badge: <Verified className="text-sky-400" />
  },
  2: {
    name: "Admin",
    glow: true,
    glowColor: "#ff0000",
    badge: <ShieldCheck className="text-red-600" />
  },
  3: {
    name: "Developer",
    badge: <Braces className="text-green-500" />
  },
  4: {
    name: "Staff",
    badge: <Shield className="text-orange-500" />
  },
  5: {
    name: "RobloxDevs Staff",
    badge: <img src="/badges/rd.png" alt="RD" />
  },
  6: {
    name: "Server Booster",
    badge: <img src="/badges/booster.png" alt="SB" />
  },
  7: {
    name: "DevSec Staff",
    badge: <img src="/badges/devsec.png" alt="DevSec" />
  },
  8: {
    name: "Scam Investigator",
    badge: <img src="/badges/scaminvestigator.png" alt="SI" />
  },
  9: {
    name: "Cato",
    badge: <img src="/badges/cato.png" alt="Cato" />
  },
}

export default badges
