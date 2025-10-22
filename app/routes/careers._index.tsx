
// Icon imports
import { FaUserShield, FaUsers, FaPaintBrush, FaCode, FaHeadset, FaRobot, FaUserFriends, FaUserTie, FaCubes, FaMagic, FaVolumeUp, FaUserSecret, FaCalendarAlt, FaGlobe, FaBookOpen, FaRegSmile, FaDiscord, FaPatreon, FaTwitter, FaArrowUp, FaGift, FaLink } from "react-icons/fa";


import type { MetaFunction } from "@remix-run/node";
import Navigation from "~/components/pages/Navigation";
import Footer from "~/components/pages/Footer";
import ComplexParticles from "../components/particles/complex-particles";
import React, { useState, useRef, useEffect } from "react";

import JobManager, { Job } from "../lib/JobManager";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";


import { useFetcher } from "@remix-run/react";


// Loader fetches jobs directly from JobManager (server-side, no fetch)
export const loader = async () => {
  try {
    const jobs = await JobManager.getJobs();
    return json({ jobs });
  } catch (err) {
    console.error("Failed to load jobs:", err);
    throw new Response("Failed to load jobs", { status: 500 });
  }
};

export const meta: MetaFunction = () => [{ title: "Careers | Studio Vivre" }];

export default function Careers() {
  let initialJobs: any[] = [];
  let loaderError = false;
  try {
    const loaderData = useLoaderData<typeof loader>();
    initialJobs = loaderData.jobs;
  } catch (e) {
    loaderError = true;
  }
  const fetcher = useFetcher();
  const [jobs, setJobs] = useState(initialJobs);
  const [typeFilter, setTypeFilter] = useState<string|null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string|null>(null);
  const [statusFilter, setStatusFilter] = useState<string|null>(null);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Poll for jobs every 3 seconds for live updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetcher.load("/careers");
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (fetcher.data && typeof fetcher.data === 'object' && 'jobs' in fetcher.data) {
      // Accept any array for jobs, even if it has extra fields (e.g. __v)
      setJobs((fetcher.data as any).jobs);
    }
  }, [fetcher.data]);
  // Modal state for applications (no longer used)

  // Map job title to icon components (title-based, dynamic)
  const titleToIcon: Record<string, JSX.Element> = {
    'Frontend Engineer': <FaCode className="text-indigo-400" />, 
    '3D Artist': <FaPaintBrush className="text-pink-400" />, 
    'Community Manager': <FaUsers className="text-purple-400" />, 
    'Moderator': <FaUserShield className="text-blue-400" />, 
    'Support Team': <FaHeadset className="text-green-400" />, 
    'Customer Service': <FaUserTie className="text-yellow-400" />, 
    'Agent': <FaUserSecret className="text-indigo-300" />, 
    'Event Host': <FaCalendarAlt className="text-pink-400" />, 
    'VFX Artist': <FaMagic className="text-purple-400" />, 
    'GFX Artist': <FaPaintBrush className="text-pink-400" />, 
    'Scripter': <FaRobot className="text-blue-400" />, 
    'Modeler': <FaCubes className="text-indigo-400" />, 
    'SFX Engineer': <FaVolumeUp className="text-yellow-400" />, 
    'Builder': <FaCubes className="text-indigo-400" />, 
    'Terrain Creator/Artist': <FaPaintBrush className="text-green-400" />,
  };

  function getJobIcon(job: any) {
    return titleToIcon[job.title] || <FaRegSmile className="text-gray-400" />;
  }

  // Now status filter is based on the 'available' property
  const filteredJobs = jobs.filter((job: any) => {
    const typeMatch = !typeFilter || job.type === typeFilter;
    const categoryMatch = !categoryFilter || job.category === categoryFilter;
    const statusMatch = !statusFilter ||
      (statusFilter === 'Available' ? job.available === true : statusFilter === 'Unavailable' ? job.available === false : true);
    const searchMatch = !search || (
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase()) ||
      job.category.toLowerCase().includes(search.toLowerCase())
    );
    return typeMatch && categoryMatch && statusMatch && searchMatch;
  });

  // --- Optimized Particle Animation ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Fewer particles for performance, smaller blur
    const PARTICLE_COUNT = width < 700 ? 18 : 28;
    const particles: {x:number, y:number, r:number, dx:number, dy:number, c:string, o:number}[] = [];
    const colors = [
      "#5EA2EF88", "#C084FC88", "#F472B688", "#A5B4FC88", "#818CF888"
    ];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 1.2,
        dx: (Math.random() - 0.5) * 0.18,
        dy: (Math.random() - 0.5) * 0.18,
        c: colors[Math.floor(Math.random() * colors.length)],
        o: Math.random() * 0.4 + 0.25
      });
    }
    let running = true;
    function animate() {
      if (!running || !ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.globalAlpha = p.o;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = p.c;
        ctx.shadowColor = p.c;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }
    animate();
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      running = false;
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (loaderError) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a16] text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Careers</h1>
        <p className="text-lg text-red-400 mb-2">Failed to load job listings. Please try again later.</p>
        <p className="text-sm opacity-60">This is usually a database or server connection issue. If you are staff, check the backend logs and MongoDB status.</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full bg-[#0a0a16] text-white flex flex-col overflow-x-hidden relative">
      {/* Modern, multi-layered animated particles background */}
      <ComplexParticles />
      {/* Animated Particles Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh'}} />
      <Navigation userInfo={undefined} />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center gap-3 z-[3] relative py-[12vh]">
        <div className="absolute bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 p-[7vw] self-center rounded-[100%] blur-[80px] z-[-1] opacity-25 left-1/2 -translate-x-1/2 top-0 animate-floatblob" />
        <h1 className="leading-none text-5xl md:text-7xl font-bold max-w-[900px] animate-hero-fade">
          Join the <span className="tracking-tight inline font-semibold from-[#5EA2EF] to-[#0072F5] bg-clip-text text-transparent bg-gradient-to-b animate-gradient-text">Moon Software</span> Team
        </h1>
        <p className="opacity-60 mt-4 max-w-[700px] mx-auto animate-fadein">Shape the future of digital experiences. We’re looking for creative, passionate people to help us build the next generation of games, assets, and communities.</p>
        <a href="#open-positions" className="mt-8 inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold px-10 py-4 rounded-full text-lg shadow-lg hover:scale-105 transition-transform animate-btn-pop">See Open Positions</a>
      </section>

      {/* Benefits Section */}
      <section className="w-full flex flex-col items-center py-20 px-4">
        <h2 className="text-4xl font-bold mb-8 text-center animate-section-pop">Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl w-full">
          <div className="bg-black/60 rounded-2xl p-8 shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)] flex flex-col items-center border border-blue-600 animate-card-float">
            <span className="text-5xl mb-4"><FaGlobe className="text-indigo-400" /></span>
            <h3 className="text-2xl font-semibold mb-2">Remote & Flexible</h3>
            <p className="opacity-80 text-center">Work from anywhere with flexible hours that fit your lifestyle.</p>
          </div>
          <div className="bg-black/60 rounded-2xl p-8 shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)] flex flex-col items-center border border-blue-600 animate-card-float2">
            <span className="text-5xl mb-4"><FaBookOpen className="text-purple-400" /></span>
            <h3 className="text-2xl font-semibold mb-2">Learning & Growth</h3>
            <p className="opacity-80 text-center">Access to courses, mentorship, and resources to help you grow professionally.</p>
          </div>
          <div className="bg-black/60 rounded-2xl p-8 shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)] flex flex-col items-center border border-blue-600 animate-card-float3">
            <span className="text-5xl mb-4"><FaRegSmile className="text-pink-400" /></span>
            <h3 className="text-2xl font-semibold mb-2">Inclusive Culture</h3>
            <p className="opacity-80 text-center">Be part of a supportive, diverse, and fun team that celebrates wins together.</p>
          </div>
          {/* --- New Benefits --- */}
          <div className="bg-black/60 rounded-2xl p-8 shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)] flex flex-col items-center border border-blue-600 animate-card-float">
            <span className="text-5xl mb-4"><FaDiscord className="text-indigo-400" /></span>
            <h3 className="text-2xl font-semibold mb-2">Discord Opportunities</h3>
            <p className="opacity-80 text-center">Connect with Discord clients, access official for-hire posts, and showcase your verified Moon Software portfolio to earn commissions and build your reputation.</p>
          </div>
          <div className="bg-black/60 rounded-2xl p-8 shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)] flex flex-col items-center border border-blue-600 animate-card-float2">
            <span className="text-5xl mb-4"><FaPatreon className="text-orange-400" /></span>
            <h3 className="text-2xl font-semibold mb-2">Patreon Earnings</h3>
            <p className="opacity-80 text-center">Sell your assets to our clients and customers via Patreon for a percentage.</p>
          </div>
          <div className="bg-black/60 rounded-2xl p-8 shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)] flex flex-col items-center border border-blue-600 animate-card-float3">
            <span className="text-5xl mb-4"><FaTwitter className="text-blue-400" /></span>
            <h3 className="text-2xl font-semibold mb-2">Twitter Exposure</h3>
            <p className="opacity-80 text-center">Showcase your work and keep the company relevant by posting on our Twitter.</p>
          </div>
          <div className="bg-black/60 rounded-2xl p-8 shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)] flex flex-col items-center border border-blue-600 animate-card-float">
            <span className="text-5xl mb-4"><FaArrowUp className="text-green-400" /></span>
            <h3 className="text-2xl font-semibold mb-2">Career Advancement</h3>
            <p className="opacity-80 text-center">Excel and improve your skills by working on exciting projects and learning as you go!</p>
          </div>
          <div className="bg-black/60 rounded-2xl p-8 shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)] flex flex-col items-center border border-blue-600 animate-card-float2">
            <span className="text-5xl mb-4"><FaGift className="text-pink-400" /></span>
            <h3 className="text-2xl font-semibold mb-2">Discord Nitro</h3>
            <p className="opacity-80 text-center">Developers and staff receive free Discord Nitro at the end of each month!</p>
          </div>
          <div className="bg-black/60 rounded-2xl p-8 shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)] flex flex-col items-center border border-blue-600 animate-card-float3">
            <span className="text-5xl mb-4"><FaLink className="text-yellow-400" /></span>
            <h3 className="text-2xl font-semibold mb-2">Connections</h3>
            <p className="opacity-80 text-center">Build and gain access to connections within the development community.</p>
          </div>
          <div className="bg-black/60 rounded-2xl p-8 shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)] flex flex-col items-center border border-blue-600 animate-card-float col-span-full md:col-span-3 mx-auto max-w-md">
            <span className="text-5xl mb-4"><FaRegSmile className="text-indigo-400" /></span>
            <h3 className="text-2xl font-semibold mb-2">More to Discover</h3>
            <p className="opacity-80 text-center">There are even more benefits and perks to be found by joining us!</p>
          </div>
        </div>
      </section>

      {/* Life at Studio Vivre Section */}
      <section className="w-full flex flex-col items-center py-20 px-4 border-t border-[#36393f]">
        <h2 className="text-4xl font-bold mb-8 text-center animate-section-pop">Life at Studio Vivre</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full">
          <div className="bg-black/60 rounded-2xl p-8 shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)] flex flex-col items-center border border-blue-600 animate-card-float2">
            <h3 className="text-xl font-semibold mb-2">Remote Friendly</h3>
            <p className="opacity-80 text-center">Work from anywhere. We support flexible schedules and remote work for all team members.</p>
          </div>
          <div className="bg-black/60 rounded-2xl p-8 shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)] flex flex-col items-center border border-blue-600 animate-card-float3">
            <h3 className="text-xl font-semibold mb-2">Growth & Learning</h3>
            <p className="opacity-80 text-center">We invest in your professional development with learning stipends, mentorship, and more.</p>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="w-full flex flex-col items-center py-20 px-4 border-t border-[#36393f]">
        <h2 className="text-4xl font-bold mb-8 text-center animate-section-pop">Open Positions</h2>
        {/* Filters & Search */}
        <div className="flex flex-wrap gap-6 mb-10 justify-center items-center">
          {/* Status Dropdown */}
          <div className="relative min-w-[160px]">
            <button
              onClick={() => setStatusDropdownOpen((v) => !v)}
              className={`w-full flex items-center justify-between px-5 py-3 rounded-xl border border-blue-600 bg-black/60 text-white font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusDropdownOpen ? 'ring-2 ring-blue-500' : ''}`}
              aria-haspopup="listbox"
              aria-expanded={statusDropdownOpen}
            >
              <span>Status{statusFilter ? `: ${statusFilter}` : ''}</span>
              <svg className={`ml-2 w-4 h-4 transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {statusDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-full bg-black/90 border border-blue-600 rounded-xl shadow-lg z-10 py-2" role="listbox">
                <li>
                  <button
                    onClick={() => { setStatusFilter(null); setStatusDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-2 rounded-lg transition font-semibold ${statusFilter === null ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' : 'hover:bg-black/40 text-white'}`}
                  >All</button>
                </li>
                <li>
                  <button
                    onClick={() => { setStatusFilter('Available'); setStatusDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-2 rounded-lg transition font-semibold ${statusFilter === 'Available' ? 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white' : 'hover:bg-black/40 text-white'}`}
                  >Available</button>
                </li>
                <li>
                  <button
                    onClick={() => { setStatusFilter('Unavailable'); setStatusDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-2 rounded-lg transition font-semibold ${statusFilter === 'Unavailable' ? 'bg-gradient-to-r from-gray-500 via-gray-700 to-gray-900 text-white' : 'hover:bg-black/40 text-white'}`}
                  >Unavailable</button>
                </li>
              </ul>
            )}
          </div>
          {/* Search Bar */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className="px-5 py-3 rounded-xl border border-blue-600 bg-black/60 text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px] max-w-xs"
            aria-label="Search jobs"
          />
          {/* Type Dropdown */}
          <div className="relative min-w-[160px]">
            <button
              onClick={() => setTypeDropdownOpen((v) => !v)}
              className={`w-full flex items-center justify-between px-5 py-3 rounded-xl border border-blue-600 bg-black/60 text-white font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${typeDropdownOpen ? 'ring-2 ring-blue-500' : ''}`}
              aria-haspopup="listbox"
              aria-expanded={typeDropdownOpen}
            >
              <span>Type{typeFilter ? `: ${typeFilter}` : ''}</span>
              <svg className={`ml-2 w-4 h-4 transition-transform ${typeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {typeDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-full bg-black/90 border border-blue-600 rounded-xl shadow-lg z-10 py-2" role="listbox">
                <li>
                  <button
                    onClick={() => { setTypeFilter(null); setTypeDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-2 rounded-lg transition font-semibold ${typeFilter === null ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' : 'hover:bg-black/40 text-white'}`}
                  >All</button>
                </li>
                <li>
                  <button
                    onClick={() => { setTypeFilter('Volunteer'); setTypeDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-2 rounded-lg transition font-semibold ${typeFilter === 'Volunteer' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' : 'hover:bg-black/40 text-white'}`}
                  >Volunteer</button>
                </li>
                <li>
                  <button
                    onClick={() => { setTypeFilter('Paid'); setTypeDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-2 rounded-lg transition font-semibold ${typeFilter === 'Paid' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' : 'hover:bg-black/40 text-white'}`}
                  >Paid</button>
                </li>
                <li>
                  <button
                    onClick={() => { setTypeFilter('Hybrid'); setTypeDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-2 rounded-lg transition font-semibold ${typeFilter === 'Hybrid' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' : 'hover:bg-black/40 text-white'}`}
                  >Hybrid</button>
                </li>
              </ul>
            )}
          </div>
          {/* Category Dropdown */}
          <div className="relative min-w-[180px]">
            <button
              onClick={() => setCategoryDropdownOpen((v) => !v)}
              className={`w-full flex items-center justify-between px-5 py-3 rounded-xl border border-blue-600 bg-black/60 text-white font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${categoryDropdownOpen ? 'ring-2 ring-blue-500' : ''}`}
              aria-haspopup="listbox"
              aria-expanded={categoryDropdownOpen}
            >
              <span>Category{categoryFilter ? `: ${categoryFilter}` : ''}</span>
              <svg className={`ml-2 w-4 h-4 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {categoryDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-full bg-black/90 border border-blue-600 rounded-xl shadow-lg z-10 py-2" role="listbox">
                <li>
                  <button
                    onClick={() => { setCategoryFilter(null); setCategoryDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-2 rounded-lg transition font-semibold ${categoryFilter === null ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' : 'hover:bg-black/40 text-white'}`}
                  >All</button>
                </li>
                <li>
                  <button
                    onClick={() => { setCategoryFilter('Development'); setCategoryDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-2 rounded-lg transition font-semibold ${categoryFilter === 'Development' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' : 'hover:bg-black/40 text-white'}`}
                  >Development</button>
                </li>
                <li>
                  <button
                    onClick={() => { setCategoryFilter('Discord'); setCategoryDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-2 rounded-lg transition font-semibold ${categoryFilter === 'Discord' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' : 'hover:bg-black/40 text-white'}`}
                  >Discord</button>
                </li>
                <li>
                  <button
                    onClick={() => { setCategoryFilter('In Person'); setCategoryDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-2 rounded-lg transition font-semibold ${categoryFilter === 'In Person' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' : 'hover:bg-black/40 text-white'}`}
                  >In Person</button>
                </li>
                <li>
                  <button
                    onClick={() => { setCategoryFilter('Roblox Development'); setCategoryDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-2 rounded-lg transition font-semibold ${categoryFilter === 'Roblox Development' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' : 'hover:bg-black/40 text-white'}`}
                  >Roblox Development</button>
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="max-w-3xl w-full flex flex-col gap-6">
          {filteredJobs.length === 0 && (
            <div className="text-center opacity-60 py-10 animate-fadein">No positions match your filters.</div>
          )}
          {filteredJobs.map((job: any, idx: number) => (
            <div key={idx} className={`bg-black/60 rounded-2xl p-6 shadow-[0px_3px_5px_0px_rgba(59,_130,_246,_0.3)] flex flex-col md:flex-row md:items-center md:justify-between border border-blue-600 relative animate-jobcard-pop${idx%3}` }>
              {/* Animated floating particle for card */}
              <div className="absolute -top-6 -right-6 w-16 h-16 pointer-events-none z-0">
                <svg width="100%" height="100%" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="24" fill="#5EA2EF44">
                    <animate attributeName="r" values="22;28;22" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="32" cy="32" r="12" fill="#C084FC44">
                    <animate attributeName="r" values="10;16;10" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold mb-1 flex items-center gap-2 animate-gradient-text" style={{backgroundClip:'text',WebkitBackgroundClip:'text',color:'transparent',backgroundImage:'linear-gradient(90deg,#5EA2EF,#C084FC,#F472B6,#5EA2EF)'}}>
                  {getJobIcon(job)} {job.title}
                </h3>
                <div className="flex gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs font-bold animate-badge-pop">{job.type}</span>
                  <span className="px-3 py-1 rounded-full bg-black/40 border border-blue-600 text-xs font-bold animate-badge-pop2">{job.category}</span>
                </div>
                <p className="opacity-80 mb-2 animate-fadein">{job.location}</p>
                <p className="opacity-70 animate-fadein" style={{animationDelay:'0.2s'}}>{job.description}</p>
              </div>
              {(job.title === "Moderator" || job.title === "Community Manager" || job.title === "Agent") && job.available ? (
                <>
                  {job.title === "Moderator" && job.available && (
                    <Link
                      to="/apply/moderator"
                      prefetch="intent"
                      className="mt-4 md:mt-0 group relative inline-flex items-center justify-center px-8 py-3 rounded-2xl font-bold text-lg bg-white/10 backdrop-blur-md border-2 border-transparent shadow-xl transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-400/60 hover:scale-105 animate-btn-pop apply-btn"
                      style={{minWidth:'140px'}}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Apply
                        <svg className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110 text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                      <span className="absolute inset-0 rounded-2xl pointer-events-none z-0 apply-btn-bg" />
                    </Link>
                  )}
                  {job.title === "Community Manager" && job.available && (
                    <Link
                      to="/apply/community-manager"
                      prefetch="intent"
                      className="mt-4 md:mt-0 group relative inline-flex items-center justify-center px-8 py-3 rounded-2xl font-bold text-lg bg-white/10 backdrop-blur-md border-2 border-transparent shadow-xl transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-400/60 hover:scale-105 animate-btn-pop apply-btn"
                      style={{minWidth:'140px'}}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Apply
                        <svg className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110 text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                      <span className="absolute inset-0 rounded-2xl pointer-events-none z-0 apply-btn-bg" />
                    </Link>
                  )}
                  {job.title === "Agent" && job.available && (
                    <Link
                      to="/apply/agent"
                      prefetch="intent"
                      className="mt-4 md:mt-0 group relative inline-flex items-center justify-center px-8 py-3 rounded-2xl font-bold text-lg bg-white/10 backdrop-blur-md border-2 border-transparent shadow-xl transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-400/60 hover:scale-105 animate-btn-pop apply-btn"
                      style={{minWidth:'140px'}}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Apply
                        <svg className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110 text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                      <span className="absolute inset-0 rounded-2xl pointer-events-none z-0 apply-btn-bg" />
                    </Link>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-4 md:mt-0 group relative inline-flex items-center justify-center px-8 py-3 rounded-2xl font-bold text-lg bg-gray-700/60 text-gray-400 border-2 border-gray-600/40 shadow-xl transition-all duration-200 overflow-hidden cursor-not-allowed apply-btn"
                  style={{minWidth:'140px'}}>
                  <span className="relative z-10 flex items-center gap-2">
                    Unavailable
                  </span>
                  <span className="absolute inset-0 rounded-2xl pointer-events-none z-0 apply-btn-bg" />
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-center opacity-60 mt-10">Don’t see a role that fits? <a href="mailto:careers@studiovivre.com" className="underline hover:text-[#5EA2EF]">Email us</a> and tell us about yourself!</p>
      </section>

      <Footer />
      {/* --- Custom Animations & Particle Styles --- */}
      <style>{`
        .apply-btn {
          box-shadow: 0 4px 32px 0 #5ea2ef22, 0 1.5px 8px 0 #c084fc22;
          background: rgba(30,32,60,0.18);
          border: 2px solid rgba(94,162,239,0.18);
        }
        .apply-btn-bg {
          background: linear-gradient(120deg, #5EA2EF55 0%, #C084FC55 50%, #F472B655 100%);
          opacity: 0.7;
          filter: blur(12px);
          transition: opacity 0.3s;
        }
        .apply-btn:hover .apply-btn-bg, .apply-btn:focus .apply-btn-bg {
          opacity: 1;
        }
        .apply-btn:hover, .apply-btn:focus {
          border: 2px solid transparent;
          box-shadow: 0 0 0 3px #5EA2EF55, 0 4px 32px 0 #c084fc33;
        }
        .apply-btn:active {
          transform: scale(0.97);
        }
        @keyframes hero-fade { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } }
        .animate-hero-fade { animation: hero-fade 1.2s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadein { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
        .animate-fadein { animation: fadein 1.2s cubic-bezier(.4,0,.2,1) both; }
        @keyframes floatblob { 0%,100% { transform: translateY(0) scale(1);} 50% { transform: translateY(-30px) scale(1.05);} }
        .animate-floatblob { animation: floatblob 10s ease-in-out infinite; }
        @keyframes gradient-text { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        .animate-gradient-text { background-size: 200% 200%; animation: gradient-text 3.5s linear infinite alternate; }
        @keyframes btn-pop { 0% { transform: scale(0.9); opacity: 0.5;} 100% { transform: scale(1); opacity: 1;} }
        .animate-btn-pop { animation: btn-pop 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes section-pop { 0% { opacity: 0; transform: scale(0.95);} 100% { opacity: 1; transform: scale(1);} }
        .animate-section-pop { animation: section-pop 0.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes card-float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
        .animate-card-float { animation: card-float 4.5s ease-in-out infinite; }
        .animate-card-float2 { animation: card-float 5.2s ease-in-out infinite 1.2s; }
        .animate-card-float3 { animation: card-float 6.1s ease-in-out infinite 2.1s; }
        @keyframes badge-pop { 0% { transform: scale(0.8); opacity: 0.5;} 100% { transform: scale(1); opacity: 1;} }
        .animate-badge-pop { animation: badge-pop 0.6s cubic-bezier(.4,0,.2,1) both; }
        .animate-badge-pop2 { animation: badge-pop 0.7s cubic-bezier(.4,0,.2,1) both 0.2s; }
        @keyframes jobcard-pop0 { 0% { opacity: 0; transform: translateY(30px);} 100% { opacity: 1; transform: none;} }
        .animate-jobcard-pop0 { animation: jobcard-pop0 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes jobcard-pop1 { 0% { opacity: 0; transform: translateY(30px);} 100% { opacity: 1; transform: none;} }
        .animate-jobcard-pop1 { animation: jobcard-pop1 0.7s cubic-bezier(.4,0,.2,1) both 0.15s; }
        @keyframes jobcard-pop2 { 0% { opacity: 0; transform: translateY(30px);} 100% { opacity: 1; transform: none;} }
        .animate-jobcard-pop2 { animation: jobcard-pop2 0.7s cubic-bezier(.4,0,.2,1) both 0.3s; }
      `}</style>
    </div>
  );
}
