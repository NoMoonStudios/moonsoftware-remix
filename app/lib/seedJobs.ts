import dbConnect from "./mongodb";
import { Job } from "./models";

const jobs = [
  {
    title: "Frontend Engineer",
    type: "Paid",
    category: "Development",
    location: "Remote | Full Time",
    description: "Help us build beautiful, performant web experiences for millions of users.",
    available: false
  },
  {
    title: "3D Artist",
    type: "Paid",
    category: "Development",
    location: "Remote | Contract",
    description: "Create stunning 3D assets and environments for our games and experiences.",
    available: false
  },
  {
    title: "Community Manager",
    type: "Paid",
    category: "Discord",
    location: "Remote | Part Time",
    description: "Engage and grow our player community across platforms and channels.",
    available: true
  },
  {
    title: "Moderator",
    type: "Volunteer",
    category: "Discord",
    location: "Remote | Part Time",
    description: "Help keep our Discord community safe, welcoming, and on-topic.",
    available: true
  },
  {
    title: "Support Team",
    type: "Volunteer",
    category: "Discord",
    location: "Remote | Part Time",
    description: "Assist users with questions, troubleshooting, and community support on Discord.",
    available: false
  },
  {
    title: "Customer Service",
    type: "Paid",
    category: "Discord",
    location: "Remote | Part Time",
    description: "Provide professional customer service and resolve user issues in our Discord channels.",
    available: false
  },
  {
    title: "Agent",
    type: "Hybrid",
    category: "Discord",
    location: "Remote | Flexible",
    description: "Agents are versatile team members on assignment—handling outreach, special tasks, and unique missions for Moon Software. Each Agent has their own specific duty and helps drive the company forward.",
    available: true
  },
  {
    title: "Event Host",
    type: "Volunteer",
    category: "In Person",
    location: "In Person | Part Time",
    description: "Host and organize in-person community events.",
    available: false
  },
  // Roblox Development Category
  {
    title: "3D Artist",
    type: "Paid",
    category: "Roblox Development",
    location: "Remote | Contract",
    description: "Design and create 3D assets for Roblox experiences and games.",
    available: false
  },
  {
    title: "VFX Artist",
    type: "Paid",
    category: "Roblox Development",
    location: "Remote | Contract",
    description: "Create visual effects to enhance gameplay and immersion in Roblox projects.",
    available: false
  },
  {
    title: "GFX Artist",
    type: "Paid",
    category: "Roblox Development",
    location: "Remote | Contract",
    description: "Produce high-quality graphics and promotional materials for Roblox games.",
    available: false
  },
  {
    title: "Scripter",
    type: "Paid",
    category: "Roblox Development",
    location: "Remote | Contract",
    description: "Develop and maintain scripts to power game mechanics and features in Roblox.",
    available: false
  },
  {
    title: "Modeler",
    type: "Paid",
    category: "Roblox Development",
    location: "Remote | Contract",
    description: "Model and texture assets for use in Roblox environments.",
    available: false
  },
  {
    title: "SFX Engineer",
    type: "Paid",
    category: "Roblox Development",
    location: "Remote | Contract",
    description: "Design and implement sound effects for immersive Roblox experiences.",
    available: false
  },
  {
    title: "Builder",
    type: "Paid",
    category: "Roblox Development",
    location: "Remote | Contract",
    description: "Construct and assemble environments, maps, and structures for Roblox games.",
    available: false
  },
  {
    title: "Terrain Creator/Artist",
    type: "Paid",
    category: "Roblox Development",
    location: "Remote | Contract",
    description: "Design and sculpt immersive terrains and landscapes for Roblox experiences.",
    available: false
  },
];

async function seedJobs() {
  await dbConnect();
  await Job.deleteMany({}); // Clear existing jobs
  await Job.insertMany(jobs);
  console.log("Seeded jobs!");
  process.exit(0);
}

seedJobs();
