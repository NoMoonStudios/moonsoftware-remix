import React, { useState, useEffect } from "react";
import { FaRegSmile, FaCode, FaPaintBrush, FaUsers, FaUserShield, FaHeadset, FaUserTie, FaUserSecret, FaCalendarAlt, FaMagic, FaRobot, FaCubes, FaVolumeUp, FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useFetcher } from "@remix-run/react";
import Navigation from "../components/pages/Navigation";
import Footer from "../components/pages/Footer";
import { Button } from "../components/ui/button";
import { Alert } from "../components/ui/alert";
import * as Dialog from "../components/ui/dialog";

const categories = [
  "Development",
  "Discord",
  "In Person",
  "Roblox Development"
];

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
// Remove stray bracket at end of file


function CreateJobDialog({ onJobCreated }: { onJobCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    type: 'Paid',
    category: categories[0],
    location: '',
    description: '',
    available: true,
    icon: '',
  });
  const [error, setError] = useState<string | null>(null);
  async function handleCreateJobSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/jobs.add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      });
      if (!res.ok) throw new Error('Failed to create job');
      setOpen(false);
      setNewJob({ title: '', type: 'Paid', category: categories[0], location: '', description: '', available: true, icon: '' });
      onJobCreated();
    } catch (e: any) {
      setError(e.message);
    }
  }
  return (
    <Dialog.Dialog open={open} onOpenChange={setOpen}>
      <Dialog.DialogTrigger asChild>
        <Button variant="glow" className="fixed bottom-8 left-8 z-50 px-6 py-2 text-lg shadow"><FaPlus /> Create Job</Button>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <h3 className="text-xl font-bold mb-2 text-gradient">Create New Job</h3>
        {error && <Alert variant="destructive" className="mb-2">{error}</Alert>}
        <form onSubmit={handleCreateJobSubmit} className="flex flex-col gap-4 w-full">
          <input required placeholder="Title" value={newJob.title} onChange={e => setNewJob(j => ({ ...j, title: e.target.value }))} className="px-3 py-2 rounded bg-black/40 border border-blue-600 text-white" />
          <select value={newJob.type} onChange={e => setNewJob(j => ({ ...j, type: e.target.value }))} className="px-3 py-2 rounded bg-black/40 border border-blue-600 text-white">
            <option value="Paid">Paid</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <select value={newJob.category} onChange={e => setNewJob(j => ({ ...j, category: e.target.value }))} className="px-3 py-2 rounded bg-black/40 border border-blue-600 text-white">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input required placeholder="Location" value={newJob.location} onChange={e => setNewJob(j => ({ ...j, location: e.target.value }))} className="px-3 py-2 rounded bg-black/40 border border-blue-600 text-white" />
          <textarea required placeholder="Description" value={newJob.description} onChange={e => setNewJob(j => ({ ...j, description: e.target.value }))} className="px-3 py-2 rounded bg-black/40 border border-blue-600 text-white" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={newJob.available} onChange={e => setNewJob(j => ({ ...j, available: e.target.checked }))} /> Available
          </label>
          <input placeholder="Icon (optional, e.g. 'frontend-engineer')" value={newJob.icon} onChange={e => setNewJob(j => ({ ...j, icon: e.target.value }))} className="px-3 py-2 rounded bg-black/40 border border-blue-600 text-white" />
          <Button type="submit" variant="glow" className="mt-2">Create</Button>
        </form>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
}
// --- Staff Dashboard Main Component ---
function StaffDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [openAppId, setOpenAppId] = useState<string | null>(null);

  // Live update jobs and applications every 3 seconds
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const jobsRes = await fetch('/api/jobs');
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);
        const appsRes = await fetch('/api/applications');
        const appsData = await appsRes.json();
        setApplications(appsData.applications || []);
      } catch (e: any) {
        setError('Failed to fetch data');
      }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 3000);
    return () => clearInterval(interval);
  }, []);

  async function handleJobToggleAvailable(_id: string) {
    setError(null);
    try {
      await fetch('/api/jobs.toggle-available', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id })
      });
      setSuccess('Job availability toggled');
    } catch {
      setError('Failed to toggle job');
    }
  }

  async function handleJobRemove(_id: string) {
    setError(null);
    try {
      await fetch('/api/jobs.remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id })
      });
      setSuccess('Job removed');
    } catch {
      setError('Failed to remove job');
    }
  }

  async function handleJobEdit(_id: string, field: string, value: string) {
    setError(null);
    try {
      await fetch('/api/jobs.edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id, updates: { [field]: value } })
      });
      setSuccess('Job updated');
      setEditingJobId(null);
      setEditField(null);
      setEditValue("");
    } catch {
      setError('Failed to update job');
    }
  }

  async function handleApplicationRemove(_id: string) {
    setError(null);
    try {
      await fetch('/api/applications.remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id })
      });
      setSuccess('Application removed');
    } catch {
      setError('Failed to remove application');
    }
  }

  // Filter applications by selected category
  const filteredApps = selectedCategory
    ? applications.filter(app => app.category === selectedCategory)
    : applications;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18182f] via-[#23234a] to-[#18182f] text-white flex flex-col">
      <Navigation userInfo={undefined} />
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">Jobs <FaPlus className="text-pink-400" /></h2>
            <CreateJobDialog onJobCreated={() => setSuccess('Job created!')} />
            {error && <Alert variant="destructive" className="my-4">{error}</Alert>}
            {success && <Alert className="my-4">{success}</Alert>}
            <div className="overflow-x-auto rounded-xl shadow border border-blue-700 bg-black/60 mt-4">
              <table className="min-w-full divide-y divide-blue-800">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white">
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-left">Available</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job._id} className="hover:bg-blue-900/30 transition">
                      <td className="px-4 py-2 flex items-center gap-2 font-semibold">
                        {getJobIcon(job)} {editingJobId === job._id && editField === 'title' ? (
                          <input value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => handleJobEdit(job._id, 'title', editValue)} className="bg-black/40 border border-blue-600 rounded px-2 py-1 text-white" autoFocus />
                        ) : (
                          <span onDoubleClick={() => { setEditingJobId(job._id); setEditField('title'); setEditValue(job.title); }}>{job.title}</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {editingJobId === job._id && editField === 'type' ? (
                          <select value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => handleJobEdit(job._id, 'type', editValue)} className="bg-black/40 border border-blue-600 rounded px-2 py-1 text-white">
                            <option value="Paid">Paid</option>
                            <option value="Volunteer">Volunteer</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        ) : (
                          <span onDoubleClick={() => { setEditingJobId(job._id); setEditField('type'); setEditValue(job.type); }}>{job.type}</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {editingJobId === job._id && editField === 'category' ? (
                          <select value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => handleJobEdit(job._id, 'category', editValue)} className="bg-black/40 border border-blue-600 rounded px-2 py-1 text-white">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        ) : (
                          <span onDoubleClick={() => { setEditingJobId(job._id); setEditField('category'); setEditValue(job.category); }}>{job.category}</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {editingJobId === job._id && editField === 'location' ? (
                          <input value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => handleJobEdit(job._id, 'location', editValue)} className="bg-black/40 border border-blue-600 rounded px-2 py-1 text-white" />
                        ) : (
                          <span onDoubleClick={() => { setEditingJobId(job._id); setEditField('location'); setEditValue(job.location); }}>{job.location}</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <Button size="sm" variant={job.available ? "glow" : "outline"} onClick={() => handleJobToggleAvailable(job._id)}>
                          {job.available ? <FaCheck className="text-green-400" /> : <FaTimes className="text-red-400" />}
                        </Button>
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingJobId(job._id); setEditField('title'); setEditValue(job.title); }}><FaEdit /></Button>
                        <Dialog.Dialog>
                          <Dialog.DialogTrigger asChild>
                            <Button size="sm" variant="destructive"><FaTrash /></Button>
                          </Dialog.DialogTrigger>
                          <Dialog.DialogContent>
                            <h4 className="font-bold mb-2">Confirm Remove</h4>
                            <p>Are you sure you want to remove this job?</p>
                            <div className="flex gap-2 mt-4">
                              <Button variant="destructive" onClick={() => handleJobRemove(job._id)}>Remove</Button>
                              <Dialog.DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </Dialog.DialogClose>
                            </div>
                          </Dialog.DialogContent>
                        </Dialog.Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">Applications</h2>
            <div className="mb-4 flex gap-2 flex-wrap">
              <Button variant={!selectedCategory ? "glow" : "outline"} onClick={() => setSelectedCategory(null)}>All</Button>
              {categories.map(cat => (
                <Button key={cat} variant={selectedCategory === cat ? "glow" : "outline"} onClick={() => setSelectedCategory(cat)}>{cat}</Button>
              ))}
            </div>
            <div className="overflow-x-auto rounded-xl shadow border border-blue-700 bg-black/60">
              <table className="min-w-full divide-y divide-blue-800">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Discord</th>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map(app => (
                    <tr key={app._id} className="hover:bg-blue-900/30 transition">
                      <td className="px-4 py-2 font-semibold">{app.name}</td>
                      <td className="px-4 py-2">{app.discord}</td>
                      <td className="px-4 py-2">{app.title}</td>
                      <td className="px-4 py-2">{app.type}</td>
                      <td className="px-4 py-2">{app.status}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <Dialog.Dialog>
                          <Dialog.DialogTrigger asChild>
                            <Button size="sm" variant="destructive"><FaTrash /></Button>
                          </Dialog.DialogTrigger>
                          <Dialog.DialogContent>
                            <h4 className="font-bold mb-2">Confirm Remove</h4>
                            <p>Are you sure you want to remove this application?</p>
                            <div className="flex gap-2 mt-4">
                              <Button variant="destructive" onClick={() => handleApplicationRemove(app._id)}>Remove</Button>
                              <Dialog.DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </Dialog.DialogClose>
                            </div>
                          </Dialog.DialogContent>
                        </Dialog.Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default StaffDashboard;
