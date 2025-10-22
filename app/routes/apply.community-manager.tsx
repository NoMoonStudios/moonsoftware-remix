
import React, { useState } from "react";
import { Link } from "@remix-run/react";
import Navigation from "~/components/pages/Navigation";
import ComplexParticles from "../components/particles/complex-particles";

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
                placeholder="e.g. moonuser#1234"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Why do you want to be a Community Manager?</label>
              <textarea
                required
                value={why}
                onChange={e => setWhy(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-blue-600 text-white focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="Tell us why you’re a great fit!"
              />
            </div>
            {/* --- Multiple Choice Questions (Placeholder) --- */}
            <div className="bg-black/40 rounded-xl p-4 border border-blue-600">
              <h3 className="font-semibold mb-2">Multiple Choice Questions</h3>
              {[0,1,2,3].map(i => (
                <div key={i} className="mb-4">
                  <label className="block mb-1">Placeholder MCQ #{i+1}</label>
                  <select
                    required
                    value={mcq[i]}
                    onChange={e => setMcq(mcq.map((v, idx) => idx === i ? e.target.value : v))}
                    className="w-full px-4 py-2 rounded-lg bg-black/60 border border-blue-600 text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>Select an answer</option>
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
              ))}
            </div>
            {/* --- True/False Questions (Placeholder) --- */}
            <div className="bg-black/40 rounded-xl p-4 border border-blue-600">
              <h3 className="font-semibold mb-2">True or False Questions</h3>
              {[0,1,2,3].map(i => (
                <div key={i} className="mb-4">
                  <label className="block mb-1">Placeholder True/False #{i+1}</label>
                  <select
                    required
                    value={tf[i]}
                    onChange={e => setTf(tf.map((v, idx) => idx === i ? e.target.value : v))}
                    className="w-full px-4 py-2 rounded-lg bg-black/60 border border-blue-600 text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>Select</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                </div>
              ))}
            </div>
            {/* --- Long Answer Questions (Placeholder) --- */}
            <div className="bg-black/40 rounded-xl p-4 border border-blue-600">
              <h3 className="font-semibold mb-2">Long Answer Questions</h3>
              {[0,1].map(i => (
                <div key={i} className="mb-4">
                  <label className="block mb-1">Placeholder Long Answer #{i+1}</label>
                  <textarea
                    required
                    value={longAnswers[i]}
                    onChange={e => setLongAnswers(longAnswers.map((v, idx) => idx === i ? e.target.value : v))}
                    className="w-full px-4 py-2 rounded-lg bg-black/60 border border-blue-600 text-white focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                    placeholder="Type your answer here..."
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="mt-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow hover:scale-105 transition animate-btn-pop"
            >Submit Application</button>
          </form>
        </div>
      </div>
      <style>{`
        .text-gradient { background: linear-gradient(90deg,#5EA2EF,#C084FC,#F472B6,#5EA2EF); background-clip: text; -webkit-background-clip: text; color: transparent; }
        .animate-gradient-text { background-size: 200% 200%; animation: gradient-text 3.5s linear infinite alternate; }
        @keyframes gradient-text { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        .animate-btn-pop { animation: btn-pop 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes btn-pop { 0% { transform: scale(0.9); opacity: 0.5;} 100% { transform: scale(1); opacity: 1;} }
        .animate-section-pop { animation: section-pop 0.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes section-pop { 0% { opacity: 0; transform: scale(0.95);} 100% { opacity: 1; transform: scale(1);} }
      `}</style>
    </div>
  );
}
