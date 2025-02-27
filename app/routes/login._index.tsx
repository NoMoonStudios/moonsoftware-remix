import type { MetaFunction } from "@remix-run/node";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from 'sonner';
import * as SharedFunctions from "~/lib/Utilities/shared";

import { FaRegUser, FaKey } from "react-icons/fa";

import Navigation from "~/components/pages/Navigation";
import Footer from "~/components/pages/Footer";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";
import { Checkbox } from "~/components/ui/checkbox";

import { UserInfo } from "~/types/init";
import { GetUserSession } from "~/lib/Utilities/client";

import { CgSpinner } from "react-icons/cg";


export const meta: MetaFunction = () => {
    return [
        { title: "Login - Moon Software" },
        { name: "description", content: "Elevate your game with stunning assets, UI/UX, and environments from skilled developers." },
    ];
};

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [userInfo, setUserInfo] = useState<UserInfo|undefined>();
    const [isLoading, setLoading] = useState(false);

    const onUserFieldChanged = useCallback((input : React.ChangeEvent<HTMLInputElement>) => {
        const usernameValue = input.target.value;
        setUsername(usernameValue);
    }, [username])

    const onPassFieldChanged = useCallback((input : React.ChangeEvent<HTMLInputElement>) => {
        const passwordValue = input.target.value;
        setPassword(passwordValue);
    }, [password])

    const onSubmit = useCallback(() => {
        setLoading(true)
        fetch('/api/v1/auth/login', {
            method: "POST",
            body: JSON.stringify({username, password})
        }).then(async res => {
            if (!res.ok) {
                setLoading(false)
                toast.error(`${res.statusText} : ${await res.text()}`)
                return;
            }
            const data = res.json()
            toast.success("Successfully logged in!");
            setLoading(false)
            window.location.href = "/";
        })
    }, [username, password])

    useEffect(() => {
        GetUserSession().then((data) => {
            if (!data) return;
            setUserInfo(data);
          })
    },[])

    return <>
        <Navigation userInfo={userInfo} />
        <div className="flex flex-col items-center">
            <Toaster />
            <div className="relative flex flex-col mt-[10vh] rounded-2xl text-center self-center justify-center items-center border border-white/10 w-[30vw] min-w-[400px] py-[8vh]">
                <h1 className="text-3xl uppercase">Login To Account</h1>
                <p className="text-sm opacity-35">Do not share your password with anyone.</p>
                <div className="flex flex-col mt-[5vh]">
                    <div className="flex flex-col text-left mt-[20px]">
                        <div className="flex flex-row gap-1 opacity-50">
                            <FaRegUser />
                            <Label htmlFor="username" className="mb-[10px] text-[14px]">Username</Label>
                        </div>
                        <Input type="text" id="username" onInput={onUserFieldChanged} className="py-6 px-4 w-[60vw] md:w-[20vw]" placeholder="username" />
                    </div>

                    <div className="flex flex-col text-left mt-[20px]">
                        <div className="flex flex-row gap-1 opacity-50">
                            <FaKey />
                            <Label htmlFor="password" className="mb-[10px] text-[14px]">Password</Label>
                        </div>
                        <Input type="password" id="password" onInput={onPassFieldChanged} className="py-6 px-4 w-[60vw] md:w-[20vw]" placeholder="*********" />
                    </div>

                    <Button variant={"default"} className="mt-[20px] flex flex-row gap-2" disabled={isLoading} onClick={onSubmit}>
                        { isLoading && <CgSpinner className="animate-spin"/> }
                        Login
                    </Button>
                </div>
            </div>
        </div>
        <Footer />
    </>
}