import type { MetaFunction } from "@remix-run/node";
import Turnstile, { useTurnstile } from "react-turnstile";

import { FaRegUser, FaKey } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";

import Navigation from "~/components/pages/Navigation";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Suspense } from "react";

export const meta: MetaFunction = () => {
    return [
        { title: "Sign Up - Moon Software" },
        { name: "description", content: "Elevate your game with stunning assets, UI/UX, and environments from skilled developers." },
    ];
};

export default function Signup() {
    const turnstile = useTurnstile();
    return <>
        <Navigation />
        <div className="flex flex-col items-center">
            <div className="flex flex-col mt-[10vh] rounded-2xl text-center self-center justify-center items-center border border-white/10 w-[30vw] py-[8vh]">
                <h1 className="text-3xl uppercase">Create An Account</h1>
                <p className="text-sm opacity-35">Please do not use your real name.</p>

                <div className="flex flex-col mt-[5vh]">

                    <div className="flex flex-col text-left">
                        <div className="flex flex-row gap-1 opacity-50">
                            <FaRegUser />
                            <Label htmlFor="username" className="mb-[10px] text-[14px]">Username</Label>
                        </div>
                        <Input type="text" id="username" className="py-6 px-4 w-[20vw]" placeholder="..." />
                    </div>

                    <div className="flex flex-col text-left mt-[20px]">
                        <div className="flex flex-row gap-1 opacity-50">
                            <MdAlternateEmail />
                            <Label htmlFor="email" className="mb-[10px] text-[14px]">Email</Label>
                        </div>
                        <Input type="email" id="email" className="py-6 px-4 w-[20vw]" placeholder="user@email.com" />
                    </div>

                    <div className="flex flex-col text-left mt-[20px]">
                        <div className="flex flex-row gap-1 opacity-50">
                            <FaKey />
                            <Label htmlFor="password" className="mb-[10px] text-[14px]">Password</Label>
                        </div>
                        <Input type="password" id="password" className="py-6 px-4 w-[20vw]" placeholder="*********" />
                    </div>

                    <Suspense fallback={<h1>Loading Captcha..</h1>}>
                        <Turnstile
                            className="mt-[40px]"
                            sitekey="0x4AAAAAAA9kLREISaBLieRe"
                            theme="dark"
                        // onVerify={(token) => {
                        //    alert(token)
                        // }}
                        />
                    </Suspense>

                    <Button variant={"default"} className="mt-[10px]">Create Account</Button>

                </div>
            </div>
        </div>
    </>
}