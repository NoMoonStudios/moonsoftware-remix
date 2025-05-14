
import { Link } from "@remix-run/react";
import { AnimatePresence, motion } from 'motion/react';
import { Button } from "~/components/ui/button";
import { UserInfo } from "~/types/init";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { useState } from "react";

function AccountMenu({userInfo}: {userInfo: UserInfo | undefined}) {
    return <motion.div 
    className="absolute w-[200px] p-2 right-0 top-full flex flex-col gap-2"
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    >
        <Link to={`/${userInfo?.username || ''}`}><Button variant={"outline"} className="w-full cursor-pointer">Profile</Button></Link>
        <Link to={'/settings'}><Button variant={"outline"} className="w-full cursor-pointer">Settings</Button></Link>
        <a href={'/logout'}><Button variant={"outline"} className="w-full cursor-pointer">Logout</Button></a>
    </motion.div>
}

export default function Navigation({ userInfo = undefined }: { userInfo: UserInfo | undefined }) {
    const [menuVisible, setMenuVisible] = useState(false)
    return (
        <div className="top-0 w-full z-50 flex flex-row bg-gradient-to-b from-black to-transparent backdrop-blur-lg items-center justify-center">
            <header className="flex flex-row p-5 gap-7 w-[80vw] h-[105px]">
                {/* Logo Area */}
                <Link to="/" className="flex flex-row gap-1 h-auto select-none">
                    <img src="/moon_icon.png" draggable={false} className="mt-auto mb-auto w-[70px] h-[80px]" loading="lazy" alt="icon" />
                    <h1 className="uppercase font-black mb-auto mt-auto">Studio Vivre   </h1>
                </Link>

                {/* Links */}
                <div className="flex flex-row gap-4 mt-auto mb-auto ml-4 text-sm">
                    <a href="/" className="hover:text-gray-300">Home</a>
                    <a href="/about" className="hover:text-gray-300">About & Work</a>
                    <a href="/projects" className="hover:text-gray-300">Projects</a>
                    <a href="/contact" className="hover:text-gray-300">Contact</a>
                </div>

                {/* Right panel links */}
                {
                    userInfo ? <>
                        <div className="flex flex-row gap-2 mt-auto mb-auto ml-auto text-sm relative">
                            <AnimatePresence>
                                { menuVisible && <AccountMenu userInfo={userInfo} />}
                            </AnimatePresence>
                            
                            { /* eslint-disable jsx-a11y/click-events-have-key-events */}
                            { /* being disabled is skill issue */ }
                            <div className="flex flex-row gap-2 cursor-pointer select-none" role="button" tabIndex={0} onClick={() => setMenuVisible(!menuVisible)}>
                                <Avatar>
                                    <AvatarImage src={userInfo.avatar} alt={`@${userInfo.username}`} />
                                    <AvatarFallback>{userInfo.username}</AvatarFallback>
                                </Avatar>
                                <h1 className="mt-auto mb-auto">
                                    {userInfo.displayName}
                                </h1>
                            </div>
                        </div>
                    </> : <>
                        <div className="flex flex-row gap-2 mt-auto mb-auto ml-auto text-sm">
                            <Button variant={"link"} asChild><Link to={'/login'}>Login</Link></Button>
                            <Button variant={"glow"} asChild><Link to={'/signup'}>Register</Link></Button>
                        </div>
                    </>
                }
            </header>
        </div>
    );
}