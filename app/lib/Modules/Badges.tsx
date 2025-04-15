import { Braces, Shield, ShieldCheck, Verified } from "lucide-react"


export type BadgeInfo = {
  name: string
  badge: React.ReactNode
}
const badges: {[key: number]: BadgeInfo} = {
  1: {
    name: "Verified",
    badge: <Verified strokeWidth={3} className="text-sky-400" /> 
  },
  2: {
    name: "Admin",
    badge: <ShieldCheck strokeWidth={3} className="text-red-600" />
  },
  3: {
    name: "Developer",
    badge: <Braces strokeWidth={3} className="text-green-500" />
  },
  4: {
    name: "Staff",
    badge: <Shield strokeWidth={3} className="text-orange-500" />
  }
}

export default badges