
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
        <Button variant={"outline"} className="cursor-pointer"><Link to={`/${userInfo?.username || ''}`}>Profile</Link></Button>
        <Button variant={"outline"} className="cursor-pointer"><Link to={'/my/account'}>Account</Link></Button>
        <Button variant={"outline"} className="cursor-pointer"><a href={'/logout'}>Logout</a></Button>
    </motion.div>
}

export default function Navigation({ userInfo = undefined }: { userInfo: UserInfo | undefined }) {
    const [menuVisible, setMenuVisible] = useState(false)
    return (
        <div className="flex flex-row backdrop-blur-lg items-center z-10 justify-center">
            <header className="flex flex-row p-5 gap-7 w-[70vw] h-[75px]">
                {/* Logo Area */}
                <Link to="/" className="flex flex-row gap-1 h-auto select-none">
                    <img src="/moon_icon.png" draggable={false} className="mt-auto mb-auto w-[30px] h-[30px]" loading="lazy" alt="icon" />
                    <h1 className="uppercase font-black mb-auto mt-auto">Moonsoftware</h1>
                </Link>

                {/* Links */}
                <div className="flex flex-row gap-4 mt-auto mb-auto ml-4 text-sm">
                    <a href="/" className="hover:text-gray-300">Home</a>
                    <a href="/about" className="hover:text-gray-300">About</a>
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
                                    {userInfo.username}
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