import type { MetaFunction } from "@remix-run/node";
import { motion } from 'motion/react';
import * as SharedFunctions from "~/lib/Utilities/shared";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { InfiniteMovingCards } from "~/components/ui/moving-cards";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"

import Navigation from "~/components/pages/Navigation"
import Footer from "~/components/pages/Footer"
import Matrix from "~/components/particles/matrix";

import { FaUsers, FaRegCircle, FaBoxOpen, FaHandshake } from "react-icons/fa";
import { FaArrowRightLong, FaDoorClosed, FaBrain, FaMoneyBill1Wave } from "react-icons/fa6";
import { IoGameController, IoStar } from "react-icons/io5";
import { MdAutoGraph } from "react-icons/md";
import { SiAltiumdesigner } from "react-icons/si";


import { ComponentProps, useEffect, useState } from "react";
import { UserInfo } from "~/types/init";
import { GetUserSession } from "~/lib/Utilities/client";

export const meta: MetaFunction = () => {
  const title = "Moon Software";
  const description = "Elevate your game with stunning assets, UI/UX, and environments from skilled developers.";
  const imageUrl = "https://media.discordapp.net/attachments/1315081714636165183/1358665688486514820/Hj2SUle.png?ex=67f4ab86&is=67f35a06&hm=f80a176f9656be6f8162e53f0e75ecaa5eb64a579f1ed351c7db9cbe901b6e90&=&format=webp&quality=lossless&width=1872&height=674";

  return [
    { title },
    { name: "description", content: description },
    
    { property: "og:title", content: title },
    { property: "og:type", content: "website" },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:url", content: "https://https://moonsoftwareroblox.com/" },
    { property: "og:description", content: description },
    { property: "og:site_name", content: "Moon Software" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:site", content: "@MoonSftwrRoblox" }, 
    
    { name: "theme-color", content: "#2F3136" }
  ];
};

export default function Index() {
  const [totalMembers, setTotalMembers] = useState<number | undefined>();
  const [totalVisits, setTotalVisits] = useState<number | undefined>();
  const [totalGames, setTotalGames] = useState<number | undefined>();

  const [userInfo, setUserInfo] = useState<UserInfo|undefined>();

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

    GetUserSession().then((data) => {
      if (!data) return;
      setUserInfo(data);
    })
  }, [])

  return (
    <div className="h-screen overflow-x-hidden">
      <Navigation userInfo={userInfo} />
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
            ><Button variant="glow" className="flex cursor-pointer items-center gap-2">
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
            <Button variant={"shadow"} asChild><a href="#process_n_steps">Learn More</a></Button></div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-[20vh] z-[2] flex flex-col w-full px-[15vw] md:p-0 md:w-auto md:flex-row md:bg-none gap-16">
          <div className="flex flex-col gap-2 text-center content-center bg-black outline-1 outline-blue-600 p-8 w-full rounded-lg md:bg-none md:outline-none md:p-0">
            <h1 className="flex gap-3 text-2xl uppercase text-center items-center justify-center"><IoGameController className="mt-auto mb-auto" size={25} /> Games</h1>
            <h1 className="text-primary text-8xl font-bold">
              {
                totalGames ? SharedFunctions.formatNumber(totalGames) + "+" : <Skeleton className="w-[150px] h-[80px]" />
              }
            </h1>
          </div>

          <div className="flex flex-col gap-2 text-center content-center bg-black outline-1 outline-blue-600 p-8 w-full rounded-lg md:bg-none md:outline-none md:p-0">
            <h1 className="flex gap-3 text-2xl uppercase text-center items-center justify-center"><FaDoorClosed className="mt-auto mb-auto" size={25} /> Total Visits</h1>
            <h1 className="text-primary text-8xl font-bold">
              {
                totalVisits ? SharedFunctions.formatNumber(totalVisits) + "+" : <Skeleton className="w-[150px] h-[80px]" />
              }
            </h1>
          </div>

          <div className="flex flex-col gap-2 text-center content-center bg-black outline-1 outline-blue-600 p-8 w-full rounded-lg md:bg-none md:outline-none md:p-0">
            <h1 className="flex gap-3 text-2xl uppercase text-center items-center justify-center"><FaUsers className="mt-auto mb-auto" size={25} /> Members</h1>
            <h1 className="text-primary text-8xl font-bold">
              {
                totalMembers ? SharedFunctions.formatNumber(totalMembers) + "+" : <Skeleton className="w-[150px] h-[80px]" />
              }
            </h1>
          </div>
        </motion.div>

        <div className="z-[3] bg-black w-full mt-[10vh] flex flex-col gap-3 justify-center items-center text-center">

          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-5xl text-white/90 font-light w-[60vw] mt-[20vh]">We specialize in developing immersive Roblox experiences that capture the core essence of your game's vision.</h1>
            <p className="opacity-60 mt-4 max-w-[800px]">Your game deserves to stand out. Our mission is to build engaging and memorable experiences on Roblox that keep players coming back for more. Let's bring your vision to life and make an impact that lasts.</p>
          </div>

          <div className="mt-[10vh] flex flex-col gap-3 justify-center items-center text-center" id="process_n_steps">
            <h1 className="text-5xl text-white/90 font-light w-[60vw] mt-[20vh]">Our process and steps</h1>
            <p className="opacity-60 mt-4 max-w-[800px]">Reliable process for achieving distinctiveness.</p>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 mt-10 gap-4">

              <div className="absolute bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 p-[7vw] self-center bottom-0 rounded-[100%] blur-[80px] z-[-1] opacity-25" />
              <div className="absolute bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 p-[7vw] right-0 top-0 self-center rounded-[100%] blur-[80px] z-[-1] opacity-25" />

              <div className="flex flex-col relative text-left p-8 rounded-xl shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)]">
                <div className="absolute right-0 top-0 opacity-10">
                  <MdAutoGraph size={250} />
                </div>
                <div className="flex flex-col gap-3 z-[3]">
                  <h1 className="text-4xl font-bold mb-[30px]">1. Plan and Envison</h1>
                  <ul className="flex flex-col gap-5">
                    <li className="flex flex-row gap-2"><FaRegCircle className="mt-auto mb-auto" size={8} />Understand the game's theme, core mechanics, and target player base.</li>
                    <li className="flex flex-row gap-2"><FaRegCircle className="mt-auto mb-auto" size={8} />Identify key gameplay features that align with the game's theme and vision.</li>
                    <li className="flex flex-row gap-2"><FaRegCircle className="mt-auto mb-auto" size={8} />Conduct market research and analyse competitors.</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col relative text-left p-8 rounded-xl bg-primary/10">
                <div className="absolute right-0 top-0 opacity-10">
                  <FaBrain size={250} />
                </div>
                <div className="flex flex-col gap-3 z-[3]">
                  <h1 className="text-4xl font-bold mb-[30px]">2. Concept Development</h1>
                  <ul className="flex flex-col gap-5">
                    <li className="flex flex-row gap-2"><FaRegCircle className="mt-auto mb-auto" size={8} />Brainstorm and prototype initial gameplay mechanics.</li>
                    <li className="flex flex-row gap-2"><FaRegCircle className="mt-auto mb-auto" size={8} />Emphasize streamlined gameplay mechanics.</li>
                    <li className="flex flex-row gap-2"><FaRegCircle className="mt-auto mb-auto" size={8} />Prioritize features for further development.</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col relative text-left p-8 rounded-xl bg-primary/10">
                <div className="absolute right-0 top-0 opacity-10">
                  <SiAltiumdesigner size={250} />
                </div>
                <div className="flex flex-col gap-3 z-[3]">
                  <h1 className="text-4xl font-bold mb-[30px]">3. Design and Refinement</h1>
                  <ul className="flex flex-col gap-5">
                    <li className="flex flex-row gap-2"><FaRegCircle className="mt-auto mb-auto" size={8} />Create digital prototypes of prioritized game mechanics.</li>
                    <li className="flex flex-row gap-2"><FaRegCircle className="mt-auto mb-auto" size={8} />Refine the gameplay, ensuring intuitive player interaction.</li>
                    <li className="flex flex-row gap-2"><FaRegCircle className="mt-auto mb-auto" size={8} />Conduct internal testing for fine-tuning.</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col relative text-left p-8 rounded-xl shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)]">
                <div className="absolute right-0 top-0 opacity-10">
                  <FaBoxOpen size={250} />
                </div>
                <div className="flex flex-col gap-3 z-[3]">
                  <h1 className="text-4xl font-bold mb-[30px]">4. Finalisation and Delivery</h1>
                  <ul className="flex flex-col gap-5">
                    <li className="flex flex-row gap-2"><FaRegCircle className="mt-auto mb-auto" size={8} />Finalize the game build and prepare it for launch.</li>
                    <li className="flex flex-row gap-2"><FaRegCircle className="mt-auto mb-auto" size={8} />Provide community management and small fixes.</li>
                    <li className="flex flex-row gap-2"><FaRegCircle className="mt-auto mb-auto" size={8} />Deliver the final game assets and offer post-launch support.</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* Ratings */}
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-5xl text-white/90 font-light w-[60vw] mt-[35vh]">Our results</h1>
            <p className="opacity-60 mt-4 max-w-[800px]">Hear what our clients have to say about out team and our services.</p>

            <div className="relative flex overflow-x-hidden bg-gradient-to-r">
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r z-[3] from-black via-transparent to-black" />

              <InfiniteMovingCards items={ratings}
                direction="right"
                speed="slow" />
            </div>
          </div>

          <div className="flex flex-col justify-center w-full items-center text-center">
            <div className="mt-[35vh] p-8 py-[80px] w-full flex flex-col justify-center items-center text-center bg-gradient-to-r from-primary to-ring">
              <h1 className="text-5xl text-white/90 font-light w-[60vw] mb-[40px]">Game Acquisition</h1>

              <div className="flex flex-col gap-6 md:flex-row">

                <div className="border-white w-full md:w-[20vw] justify-between items-center text-center border-2 rounded-3xl p-4 px-[20px] flex flex-col">
                  <IoStar size={50} className="mt-[20px] mb-[5px]" />
                  <h1 className="text-4xl font-bold mb-[10px]">Acquisition</h1>
                  <p className="mb-[30px]">Considering selling your game? Contact us for a quote or tell us your price. Our experts will assist you through the full process, from negotiation to payment.</p>
                </div>

                <div className="border-white w-full md:w-[20vw] justify-between items-center text-center border-2 rounded-3xl p-4 px-[20px] flex flex-col">
                  <FaHandshake size={50} className="mt-[20px] mb-[5px]" />
                  <h1 className="text-4xl font-bold mb-[10px]">Partnership</h1>
                  <p className="mb-[30px]">Not looking to sell your game entirely? We also provide partnership options based on a percentage model. Get in touch for more information.</p>
                </div>

                <div className="border-white w-full md:w-[20vw] justify-between items-center text-center border-2 rounded-3xl p-4 px-[20px] flex flex-col">
                  <FaMoneyBill1Wave size={50} className="mt-[20px] mb-[5px]" />
                  <h1 className="text-4xl font-bold mb-[20px]">Investment</h1>
                  <p className="mb-[30px]">We provide investments in return for a stake in your game. If you're interested, reach out for an estimate.</p>
                </div>

              </div>

              <Button variant={"outline"} className="mt-[30px] px-10 py-6 text-xl cursor-pointer" size={"lg"} color="white">Contact</Button>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center text-center w-full mb-[40px]">
            <h1 className="text-5xl text-white/90 font-light w-[60vw] mt-[20vh]">Our FAQs</h1>
            <Accordion type="single" className="w-[45vw] mt-[40px] text-left" collapsible>
              {FAQs.map((faq, idx) => (
                <AccordionItem key={idx} value={`${faq.title}`}>
                  <AccordionTrigger className="text-[20px]">{faq.title}</AccordionTrigger>
                  <AccordionContent>
                    {faq.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

const ratings = [
  {
    quote:
      "syn helped me with a problem i had been struggling with all day, super quickly too.",
    name: "smellycheese08",
    title: "⭐️⭐️⭐️⭐️⭐️",
  },
  {
    quote:
      "Got my models fast and they made adjustments as I need the models fixed and changed. Fast and cheap would recommend.",
    name: "Vintage",
    title: "⭐️⭐️⭐️⭐️⭐️",
  },
  {
    quote: "Hired boldyboat for long term to join Phobia Productions, his first model he did really well on, hoping he can import the models himself tho. He connected with the team pretty fast and they’re starting to warm up to him. Overall, he’s been a good developer for our team by far and hope he can be there when our game reaches sky high.",
    name: "cvoz",
    title: "⭐️⭐️⭐️⭐️⭐️",
  },
  {
    quote:
      "Commissioned a model for my game and everything was done both fast and effectively by boldyboat, I'm overall really happy with the end result. Boldy was great at communicating with me and presenting his own ideas to the model and making sure i was on board with everything before going forward. ",
    name: "Frank Plywood",
    title: "⭐️⭐️⭐️⭐️⭐️",
  },
  {
    quote:
      "I was buying a scripter’s services for my game. The scripter went beyond my expectations for the job and even added a few things I needed, even when I didn’t ask him for them. The job did take a lot longer than it should have, but overall, the services were great.",
    name: "Sir Bobux Mogger",
    title: "⭐️⭐️⭐️⭐️",
  },
];

let FAQs = [
  {
    title: "What is the game development process?",
    content: "Our game development process begins with understanding your vision and goals. We then move into concept development, where we outline the core gameplay mechanics, art style, and overall structure of the game. Once the concept is solidified, we proceed to prototype, develop, and iterate on the game, ensuring that it aligns with your expectations. Finally, we conduct thorough testing, polish the final build, and prepare it for launch on the desired platforms."
  },
  {
    title: "How much does a game project cost?",
    content: 'This will always depend on the request so please contact us at the top of the page, "Contact".'
  },
  {
    title: "How long does it take?",
    content: "The timeline for game development depends on the project's complexity and scale. Smaller games may take a couple weeks to few months, while larger, more complex projects can take a year or more. We'll provide a detailed timeline during the planning phase, ensuring you know what to expect at each stage of development."
  },
  {
    title: "Do you offer custom game models or use pre-made assets?",
    content: "We specialize in creating custom game designs tailored to your unique vision. While we do utilize pre-made assets if requested, the core gameplay, mechanics, and art are usually custom-made to ensure the final product aligns with your project visions. "
  },
  {
    title: "Can you redesign my existing game/request",
    content: "Yes, we do offer small updates, bug fixes, and changes. Depending on the size you could receive a discount or for free!"
  },
  {
    title: "What if I don't like the initial concepts?",
    content: "Your satisfaction is our priority. If the initial game concepts don't meet your expectations, we'll work closely with you to understand your feedback and make the necessary adjustments. We believe in a collaborative process and won't move forward until you're completely satisfied with the direction of your game.\nIf not a refund can be worked out."
  },
  {
    title: "How do I get started?",
    content: "To get started, contact us to schedule an initial consultation where we will discuss your needs, preferences, and any specific requirements you have for your commision/project."
  },
  {
    title: 'What payment methods do you accept?',
    content: "We accept a variety of payment methods to make the process convenient for you, including CashApp, Venmo, Payoneer, Square, bank transfers, Zelle, and even Robux. If you have a preferred method not listed here, feel free to ask, and we'll do our best to accommodate your needs."
  }
]