import type { MetaFunction } from "@remix-run/node";
import Turnstile, { useTurnstile } from "react-turnstile";
import { Suspense, useCallback, useState } from "react";
import { toast } from 'sonner';
import { blacklistedUsernames, isStrictValidEmail, validateUsername } from "~/lib/functions";

import { FaRegUser, FaKey } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";

import Navigation from "~/components/pages/Navigation";
import Footer from "~/components/pages/Footer";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";
import { Checkbox } from "~/components/ui/checkbox";

export const meta: MetaFunction = () => {
    return [
        { title: "Sign Up - Moon Software" },
        { name: "description", content: "Elevate your game with stunning assets, UI/UX, and environments from skilled developers." },
    ];
};

export default function Signup() {
    const turnstile = useTurnstile();

    const [captchaVisible, VisibleCaptcha] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isAcceptedTOS, setAcceptedTOS] = useState(false);

    const [errors, setError] = useState<{username:boolean|string, email:boolean|string, password:boolean|string, acceptedTerms:boolean|string}>({
        username: false,
        email: false,
        password: false,
        acceptedTerms: false
    })

    const onUserFieldChange = useCallback((input: React.ChangeEvent<HTMLInputElement>) => {
        let userText = input.target.value
        if ( blacklistedUsernames.includes(userText.toLowerCase()) ) {
            setError((prev) => ({
                ...prev,
                username: "User name not allowed"
            }))
            return;
        } else if (userText.length < 3 && userText !== "") {
            setError((prev) => ({
               ...prev,
                username: "Username must be at least 3 characters long"
            }))
            return;
        } else if (userText.length > 16) {
            setError((prev) => ({
                ...prev,
                username: "Username must be less than 16 characters long"
            }))
            return;
        } else {
            setError((prev) => ({
                ...prev,
                username: false
            }))
        }
        setUsername(userText)
    },[])

    const onEmailFieldChange = useCallback((input: React.ChangeEvent<HTMLInputElement>) => {
        let userText = input.target.value
        if ( !isStrictValidEmail(userText) && userText!== "" ) {
            setError((prev) => ({
                ...prev,
                email: "Invalid email"
            }))
            return;
        } else {
            setError((prev) => ({
                ...prev,
                email: false
            }))
        }
        setEmail(userText)
    },[])

    const onPasswordFieldChange = useCallback((input: React.ChangeEvent<HTMLInputElement>) => {
        let password = input.target.value
        if (password.length < 8 && password!== "") {
            setError((prev) => ({
               ...prev,
                password: "Password must be at least 8 characters long"
            }))
            return;
        } else if (password.length > 64) {
            setError((prev) => ({
               ...prev,
                password: "Password must be less than 64 characters long"
            }))
            return;
        } else {
            setError((prev) => ({
              ...prev,
                password: false
            }))
        }
        setPassword(password)
    }, [])

    const handleCheckToggle = useCallback((value : boolean)=>{
        setAcceptedTOS(value)
    },[])

    const handleCreateAccount = useCallback(() => {
        if (!username) return toast.error("Username is required");
        if (!email) return toast.error("Email is required");
        if (!password) return toast.error("Password is required");
        if (blacklistedUsernames.includes(username.toLowerCase())) return toast.error("Username is not allowed");
        if (errors.username || errors.email || errors.password) return toast.error("Please fix the errors above.");
        if (username.length < 3) return toast.error("Username must be at least 3 characters long");
        if (username.length > 16) return toast.error("Username must be less than 16 characters long");
        if (password.length < 8) return toast.error("Password must be at least 8 characters long");
        if (password.length > 64) return toast.error("Password must be less than 64 characters long");
        if (!isAcceptedTOS) return toast.error("You must accept the terms of service");
        VisibleCaptcha(true);
    }, [username, email, password, isAcceptedTOS]);

    const handleAccountCreation = useCallback((token: string) => {
        VisibleCaptcha(false);
        setLoading(true)
        const promise = new Promise<any>((resolve, reject) => {
            fetch("/api/v1/auth/signup", { 
                method: "POST",
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    validateToken: token,
                    acceptedTerms: isAcceptedTOS
                }) 
            }).then(res => {
                return res.json()
            }).then(data => {
                if (data.error) {
                    reject(data.error)
                }
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
        toast.promise(promise, {
            loading: "Creating your account, please wait.",
            success: (data) => {
                console.log(data)
                VisibleCaptcha(false);
                setLoading(false);
                return `Account created successfully!`
            },
            error: (err) => {
                VisibleCaptcha(false);
                setLoading(false);
                return `An error occurred while creating your account. ${err}`
            }
        })
    }, [username, email, password, isAcceptedTOS])

    return <>
        <Navigation />
        <div className="flex flex-col items-center">
            <Toaster />
            <div className="relative flex flex-col mt-[10vh] rounded-2xl text-center self-center justify-center items-center border border-white/10 w-[30vw] min-w-[400px] py-[8vh]">
                {
                    isLoading && <>
                        <div className="flex flex-col absolute w-full h-full items-center bg-black z-10">
                            <div className="flex flex-col items-center mt-auto mb-auto gap-5">
                                <AiOutlineLoading size={60} className="animate-spin" />
                                <h1>Creating Account..</h1>
                            </div>
                        </div>
                    </>
                }

                <h1 className="text-3xl uppercase">Create An Account</h1>
                <p className="text-sm opacity-35">Please do not use your real name.</p>

                {captchaVisible == false ? (
                    <div className="flex flex-col mt-[5vh]">
                        <div className="flex flex-col text-left">
                            <div className="flex flex-row gap-1 opacity-50">
                                <FaRegUser />
                                <Label htmlFor="username" className="mb-[10px] text-[14px]">Username</Label>
                            </div>
                            <Input type="text" onInput={onUserFieldChange} id="username" className="py-6 px-4 w-[60vw] md:w-[20vw]" placeholder="..." />
                            <div>
                                {errors.username && <p className="text-red-500 text-[12px]">{errors.username}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col text-left mt-[20px]">
                            <div className="flex flex-row gap-1 opacity-50">
                                <MdAlternateEmail />
                                <Label htmlFor="email" className="mb-[10px] text-[14px]">Email</Label>
                            </div>
                            <Input type="email" onInput={onEmailFieldChange} id="email" className="py-6 px-4 w-[60vw] md:w-[20vw]" placeholder="user@email.com" />
                            <div>
                                {errors.email && <p className="text-red-500 text-[12px]">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col text-left mt-[20px]">
                            <div className="flex flex-row gap-1 opacity-50">
                                <FaKey />
                                <Label htmlFor="password" className="mb-[10px] text-[14px]">Password</Label>
                            </div>
                            <Input type="password" onInput={onPasswordFieldChange} id="password" className="py-6 px-4 w-[60vw] md:w-[20vw]" placeholder="*********" />
                            <div>
                                {errors.password && <p className="text-red-500 text-[12px]">{errors.password}</p>}
                            </div>
                        </div>

                        <div className="flex flex-row mt-[30px] gap-2">
                            <Checkbox className="mt-auto mb-auto" id="terms_checkbox" onCheckedChange={handleCheckToggle} />
                            <div className="flex flex-col text-left">
                                <Label htmlFor="terms_checkbox" className="font-bold">Accept terms and conditions</Label>
                                <p className="opacity-50 text-[10px]">You must accept our Terms & Services in order to signup.</p>
                            </div>
                        </div>

                        <Button variant={"default"} className="mt-[20px]" onClick={handleCreateAccount}>Create Account</Button>
                    </div>
                ) : (
                    <Suspense fallback={<h1>Loading Captcha..</h1>}>
                        <Turnstile
                            className="mt-[40px]"
                            sitekey="0x4AAAAAAA9kLREISaBLieRe"
                            theme="dark"
                            onVerify={handleAccountCreation}
                        />
                    </Suspense>
                )}

            </div>
        </div>
        <Footer />
    </>
}