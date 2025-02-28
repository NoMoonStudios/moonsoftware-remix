import type { MetaFunction } from "@remix-run/node";
import { Suspense, useCallback, useEffect, useState } from "react";

import Navigation from "~/components/pages/Navigation";
import Footer from "~/components/pages/Footer";
import { Toaster } from "~/components/ui/sonner";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";

import { UserInfo } from "~/types/init";
import { GetUserSession } from "~/lib/Utilities/client";
import { Button } from "~/components/ui/button";

import { RiBuilding3Line } from "react-icons/ri";
import { FaRegFileCode, FaFire } from "react-icons/fa";
import { LuPencilRuler } from "react-icons/lu";
import { FiBox } from "react-icons/fi";
import { AspectRatio } from "~/components/ui/aspect-ratio";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "~/components/ui/carousel"

export const meta: MetaFunction = () => {
    return [
        { title: "About Us - Moon Software" },
        { name: "description", content: "Elevate your game with stunning assets, UI/UX, and environments from skilled developers." },
    ];
};

export default function About() {

    const [selectedOption, setSelected] = useState("building")
    const [userInfo, setUserInfo] = useState<UserInfo | undefined>();

    useEffect(() => {
        GetUserSession().then((data) => {
            if (!data) return;
            setUserInfo(data);
        })
    }, [])

    const handleSelection = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const option = event.currentTarget.dataset.value || "building";
        setSelected(option);
    }, [selectedOption])

    return <>
        <Navigation userInfo={userInfo} />
        <div className="flex flex-col items-center">
            <Toaster />
            <div className="w-[40vw] mt-[10vh]">
                <h1 className="text-3xl font-bold">About Us</h1>
                <p className="text-base opacity-70 mt-[3vh]">
                    Moon Software is a development company that specializes in creating stunning assets and games. We are passionate about creating high-quality products that meet the needs of our clients.
                </p>

                <hr className="my-[8vh] opacity-40" />

                <h1 className="text-3xl font-bold">Portfolio</h1>
                <p className="text-base opacity-70 mt-[3vh]">
                    Our portfolio includes a wide range of projects, including:
                </p>

                <div className="flex flex-row flex-wrap gap-3 mt-[2vh]">
                    <Button variant={"outline"} data-value="building" onClick={handleSelection} disabled={selectedOption == "building"}>
                        <RiBuilding3Line />
                        Building
                    </Button>

                    <Button variant={"outline"} data-value="scripting" onClick={handleSelection} disabled={selectedOption == "scripting"}>
                        <FaRegFileCode />
                        Scripting
                    </Button>

                    <Button variant={"outline"} data-value="ui" onClick={handleSelection} disabled={selectedOption == "ui"}>
                        <LuPencilRuler />
                        UI/UX
                    </Button>

                    <Button variant={"outline"} data-value="models" onClick={handleSelection} disabled={selectedOption == "models"}>
                        <FiBox />
                        3D Models
                    </Button>

                    <Button variant={"outline"} data-value="vfx" onClick={handleSelection} disabled={selectedOption == "vfx"}>
                        <FaFire />
                        VFX
                    </Button>
                </div>

                <div className="flex flex-row mt-[5vh]">
                    {
                        work[selectedOption] ? <>
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {
                                        Array.from({ length: work[selectedOption].entries }).map((value, index) => (
                                            <CarouselItem>
                                                <AspectRatio ratio={16 / 9}>
                                                    <img loading="lazy" src={work[selectedOption].url + "/" + (index + 1) + ".png"} className="w-full h-full object-cover rounded-xl" />
                                                </AspectRatio>
                                            </CarouselItem>
                                        ))
                                    }

                                    {
                                        selectedOption == "building" && <CarouselItem>
                                        <AspectRatio ratio={16 / 9}>
                                            <video muted loop controls={false} autoPlay>
                                                <source src="/work/building/video1.mp4"/>
                                            </video>
                                        </AspectRatio>
                                    </CarouselItem>
                                    }
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </> : <>
                        <div className="flex flex-col gap-2 text-center items-center justify-center w-full">
                            <h1 className="text-3xl">Oops!</h1>
                            <p>This section doesn't exists.</p>
                        </div>
                        </>
                    }
                </div>

                <hr className="my-[8vh] opacity-40" />

                <div className="flex flex-col gap-3">
                    <h1 className="text-3xl font-bold mb-[5vh]">Meet Our Team</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
                        {
                            teamMembers.map((member, index) => {
                                return <>
                                    <div key={index} className="flex flex-col items-center text-center gap-1 w-full md:w-[13vw] bg-gray-950/30 p-6 px-12 rounded-3xl border border-primary">
                                        <Avatar className="w-20 h-20">
                                            <AvatarImage src={member.image} alt={member.name} />
                                            <AvatarFallback>{member.alt ?? member.name}</AvatarFallback>
                                        </Avatar>
                                        <h1 className="mt-[1vh] mb-auto">{member.name}</h1>
                                        <p className="text-sm opacity-30">{member.role}</p>
                                    </div>
                                </>
                            })
                        }
                    </div>
                </div>

            </div>
        </div>
        <Footer />
    </>
}

const work = {
    building: {
        entries: 12,
        url: '/work/building'
    },
    ui: {
        entries: 8,
        url: '/work/ui'
    }, 
    models: {
        entries: 13,
        url: '/work/modeling'
    }
} as {
    [key: string]: {
        entries: number,
        url: string,
        type?: string
    }
}

const teamMembers = [
    {
        name: "NoMula",
        alt: "NM",
        role: "Founder",
        image: "/team/nomula.png",
    },
    {
        name: "Synitx",
        alt: "SYN",
        role: "Co-Founder",
        image: "/team/synitx.jpg",
    },
    {
        name: "Boldy Boat",
        alt: "BB",
        role: "Lead Developer",
        image: "/team/boldy.webp",
    },
    {
        name: "Knight",
        alt: "K",
        role: "Manager",
        image: "/team/knight.jpg",
    },
    {
        name: "Wheat",
        alt: "W",
        role: "Manager",
        image: "/team/wheat.webp",
    },
    {
        name: "Cato",
        alt: "C",
        role: "Lead Programmer",
        image: "/team/cato.webp",
    },
    {
        name: "SinisterlyMad",
        alt: "SM",
        role: "Lead Programmer",
        image: "/team/sinister.jpg",
    }
]