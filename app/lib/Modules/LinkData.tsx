import * as Brands from "@icons-pack/react-simple-icons";
import * as Icons from "lucide-react";

// !!! WARNING !!!

// Please do NOT fucking change the order
// ONLY ADD FROM THE END PLEASE

// READ THE FUCKING WARNING
type Link = {
  icon: unknown,
  url: string
}
const LinkData: { [key: string]: Link } = {
  custom: { icon: Icons.Globe, url: "" },
  discord: { icon: Brands.SiDiscord, url: "https://discord.gg/" },
  github: { icon: Brands.SiGithub, url: "https://github.com/" },
  roblox: { icon: Brands.SiRoblox, url: "https://roblox.com/users/" },
  snapchat: { icon: Brands.SiSnapchat, url: "https://snapchat.com/" },
  twitch: { icon: Brands.SiTwitch, url: "https://twitch.tv/" },
  youTube: { icon: Brands.SiYoutube, url: "https://youtube.com/" },
  reddit: { icon: Brands.SiReddit, url: "https://reddit.com/u/" },
  spotify: { icon: Brands.SiSpotify, url: "https://open.spotify.com/" },
  steam: { icon: Brands.SiSteam, url: "https://steamcommunity.com/" },
  tikTok: { icon: Brands.SiTiktok, url: "https://tiktok.com/" },
  instagram: { icon: Brands.SiInstagram, url: "https://instagram.com/" },
  x: { icon: Brands.SiX, url: "https://x.com/" },
}

export default LinkData
