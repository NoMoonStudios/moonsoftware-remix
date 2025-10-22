import React, { useState } from "react";
import { Link } from "@remix-run/react";
import Navigation from "~/components/pages/Navigation";
import ComplexParticles from "../../components/particles/complex-particles";

export default function CommunityManagerApplication() {
  const [server, setServer] = useState("");
  const [name, setName] = useState("");
  const [discord, setDiscord] = useState("");
  const [why, setWhy] = useState("");
  const [mcq, setMcq] = useState(["", "", "", ""]);
  const [tf, setTf] = useState(["", "", "", ""]);
  const [longAnswers, setLongAnswers] = useState(["", ""]);
  const [submitted, setSubmitted] = useState(false);

  const servers = [
    "Sithis Hub",
    "Moon Software Office",
    "Roblox Devs",
    "Fischie"
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // TODO: Implement actual submission logic (API call, etc.)
  }

  if (submitted) {
    return (
      <div className="min-h-screen w-full bg-black text-white flex flex-col overflow-x-hidden relative">
        <Navigation userInfo={undefined} />
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="bg-black/70 p-10 rounded-2xl shadow-xl border border-blue-600 max-w-lg w-full text-center animate-section-pop mt-16">
            <h2 className="text-3xl font-bold mb-4 text-gradient animate-gradient-text">Thank you for applying!</h2>
            <p className="mb-6 opacity-80">We’ve received your application for <b>Community Manager</b> and will review it soon. If selected, we’ll reach out via Discord.</p>
            <Link to="/careers" className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow hover:scale-105 transition animate-btn-pop">Back to Careers</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a16] text-white flex flex-col overflow-x-hidden relative">
      {/* Modern, multi-layered animated particles background */}
      <ComplexParticles />
      <Navigation userInfo={undefined} />
      <div className="flex flex-col items-center justify-center flex-1 py-16 px-4">
        <div className="bg-black/70 p-10 rounded-2xl shadow-xl border border-blue-600 max-w-lg w-full animate-section-pop">
          <h1 className="text-3xl font-bold mb-2 text-gradient animate-gradient-text">Apply for Community Manager</h1>
          <p className="mb-6 opacity-80">Join our team and help grow and engage our community across platforms!</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block mb-1 font-semibold">Which server are you applying for?</label>
              <select
                required
                value={server}
                onChange={e => setServer(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-blue-600 text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select a server</option>
                {servers.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Your Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-blue-600 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Discord Username</label>
              <input
                required
                type="text"
                value={discord}
                onChange={e => setDiscord(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-blue-600 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. username#1234"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Why do you want to be a Community Manager?</label>
              <textarea
                required
                value={why}
                onChange={e => setWhy(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-blue-600 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Share your motivation and experience"
              />
            </div>
            {/* Additional form fields can be added here */}
            <button type="submit" className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow hover:scale-105 transition animate-btn-pop">Submit Application</button>
          </form>
        </div>
      </div>
    </div>
  );
}
