import { Button } from "~/components/ui/button";

export default function Navigation() {
    return (
        <div className="flex flex-row backdrop-blur-lg items-center z-10 justify-center">
            <header className="flex flex-row p-5 gap-7 w-[70vw]">
                {/* Logo Area */}
                <a href="/" className="flex flex-row gap-1 h-auto select-none">
                    <img src="/moon_icon.png" draggable={false} className="mt-auto mb-auto w-[30px] h-[30px]" loading="lazy" alt="icon" />
                    <h1 className="uppercase font-black mb-auto mt-auto">Moonsoftware</h1>
                </a>

                {/* Links */}
                <div className="flex flex-row gap-4 mt-auto mb-auto ml-4 text-sm">
                    <a href="/" className="hover:text-gray-300">Home</a>
                    <a href="/about" className="hover:text-gray-300">About</a>
                    <a href="/projects" className="hover:text-gray-300">Projects</a>
                    <a href="/contact" className="hover:text-gray-300">Contact</a>
                </div>

                {/* Right panel links */}
                <div className="flex flex-row gap-2 mt-auto mb-auto ml-auto text-sm">
                    <Button variant={"link"}>Login</Button>
                    <Button variant={"glow"}>Register</Button>
                </div>
            </header>
        </div>
    );
}