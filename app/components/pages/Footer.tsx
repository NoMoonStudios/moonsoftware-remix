import { Button } from "~/components/ui/button";
import { CiMail } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";

export default function Navigation() {
    return (
        <footer className="flex flex-col bg-black items-center z-10 justify-center bottom-0 gap-10 p-16">
            <div className="flex flex-row mt-[100px]">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-2">
                        <a href="/" className="flex flex-row gap-1 h-auto select-none">
                            <img src="/moon_icon.png" draggable={false} className="mt-auto mb-auto w-[30px] h-[30px]" loading="lazy" alt="icon" />
                            <h1 className="uppercase font-black mb-auto mt-auto">Moonsoftware</h1>
                        </a>
                        <p className="opacity-40 text-[13px] max-w-[300px]">
                            Development company creating stunning assets and games.
                        </p>
                    </div>
                    <Button variant={"secondary"} className="flex flex-row">
                        <CiMail size={40} />
                        Contact Us
                    </Button>
                </div>

                <div className="mx-[10vw]" />

                <div className="flex flex-col gap-2 mr-[5vw]">
                    <a href="/" className="hover:text-gray-300">Home</a>
                    <a href="/about" className="hover:text-gray-300">About</a>
                    <a href="/projects" className="hover:text-gray-300">Projects</a>
                    <a href="/contact" className="hover:text-gray-300">Contact</a>
                </div>

                <div className="flex flex-col gap-2">
                    <a href="/" className="flex flex-row gap-1 hover:text-gray-300"><FaXTwitter size={20} /> Twitter</a>
                    <a href="/" className="flex flex-row gap-1 hover:text-gray-300"><FaLinkedin size={20} /> LinkedIn</a>
                    <a href="/" className="flex flex-row gap-1 hover:text-gray-300"><FaDiscord size={20} /> Discord</a>
                </div>
            </div>

            <div className="flex flex-row mt-12 text-center opacity-70">
                <span>Copyright &#169; {new Date().getUTCFullYear()} Moonsoftware. All Rights Reserved.<br />Made with 💖 by <span className="text-green-300">ByteArc</span> Technologies</span>
            </div>
        </footer>
    );
}