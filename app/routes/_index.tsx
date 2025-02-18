import type { MetaFunction } from "@remix-run/node";
import { motion } from 'motion/react';
import { formatNumber } from "~/lib/functions";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

import Navigation from "~/components/pages/Navigation"
import Matrix from "~/components/particles/matrix";

import { FaUsers } from "react-icons/fa";
import { FaArrowRightLong, FaDoorClosed } from "react-icons/fa6";
import { IoGameController } from "react-icons/io5";

import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Moon Software" },
    { name: "description", content: "Elevate your game with stunning assets, UI/UX, and environments from skilled developers." },
  ];
};

export default function Index() {
  const [totalMembers, setTotalMembers] = useState<number | undefined>();
  const [totalVisits, setTotalVisits] = useState<number | undefined>();
  const [totalGames, setTotalGames] = useState<number | undefined>();

  useEffect(() => {
    if (totalMembers || totalVisits || totalGames) return;
    fetch("/api/stats/members").then(res => res.json()).then(data => {
      if (!data.success) return;
      setTotalMembers(data.count);
    })
    fetch("/api/stats/games").then(res => res.json()).then(data => {
      if (!data.success) return;
      setTotalVisits(data.count.gameVisits);
      setTotalGames(data.count.totalGames)
    })
  }, [])

  return (
    <div className="h-screen overflow-x-hidden">
      <Navigation />
      <div className="flex flex-col justify-center items-center text-center gap-3 z-[3]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Matrix height="auto" /></motion.div>

        <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-[1] mt-[20vh] flex flex-col">
          <h1 className="leading-none text-5xl font-bold max-w-[800px]">Elevate your game with <span className="tracking-tight inline font-semibold from-[#5EA2EF] to-[#0072F5] bg-clip-text text-transparent bg-gradient-to-b">stunning</span> assets UI/UX and environments from skilled developers</h1>
          <p className="opacity-60 mt-4">Development company creating stunning assets and games.</p>
          <div className="absolute bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 p-[7vw] self-center rounded-[100%] blur-[80px] z-[-1] opacity-25" />
          <div className="flex flex-row gap-6 justify-center items-center mt-6">
            <motion.div
              whileHover="hover"
              className="inline-block"
            ><Button variant="glow" className="flex items-center gap-2">
                Get Started
                <motion.span
                  initial={{ opacity: 0, x: -5, display: 'none' }}
                  variants={{
                    hover: { x: 2, opacity: 1, display: 'block' },
                  }}
                >
                  <FaArrowRightLong />
                </motion.span>
              </Button>
            </motion.div>
            <Button variant={"shadow"}>Learn More</Button></div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-[20vh] z-[2] flex flex-row gap-16">
          <div className="flex flex-col gap-2 text-center content-center">
            <h1 className="flex gap-3 text-2xl uppercase"><IoGameController className="mt-auto mb-auto" size={25} /> Games</h1>
            <h1 className="text-primary text-8xl font-bold">
              {
                totalGames ? formatNumber(totalGames) + "+" : <Skeleton className="w-[150px] h-[80px]" />
              }
            </h1>
          </div>

          <div className="flex flex-col gap-2 text-center content-center">
            <h1 className="flex gap-3 text-2xl uppercase"><FaDoorClosed className="mt-auto mb-auto" size={25} /> Total Visits</h1>
            <h1 className="text-primary text-8xl font-bold">
              {
                totalVisits ? formatNumber(totalVisits) + "+" : <Skeleton className="w-[150px] h-[80px]" />
              }
            </h1>
          </div>

          <div className="flex flex-col gap-2 text-center content-center">
            <h1 className="flex gap-3 text-2xl uppercase"><FaUsers className="mt-auto mb-auto" size={25} /> Members</h1>
            <h1 className="text-primary text-8xl font-bold">
              {
                totalMembers ? formatNumber(totalMembers) + "+" : <Skeleton className="w-[150px] h-[80px]" />
              }
            </h1>
          </div>
        </motion.div>

        <div className="z-[3] bg-black w-full mt-[10vh] flex flex-col gap-3 justify-center items-center text-center">
          <h1 className="text-5xl text-white/90 font-light w-[60vw] mt-[20vh]">We specialize in developing immersive Roblox experiences that capture the core essence of your game's vision.</h1>
          <p className="opacity-60 mt-4 max-w-[800px]">Your game deserves to stand out. Our mission is to build engaging and memorable experiences on Roblox that keep players coming back for more. Let's bring your vision to life and make an impact that lasts.</p>
        </div>

      </div>
    </div>
  );
}