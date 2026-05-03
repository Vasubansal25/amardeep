import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";
import { usersAPI, projectsAPI, tasksAPI } from "../../api/index";
import Header from "../other/Header";
import CreateTask from "../other/CreateTask";
import AllTask from "../other/AllTask";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ taskCounts: { new:0, active:0, completed:0, failed:0, overdue:0, total:0 }, projectCount:0, recentTasks:[] });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [dashRes, projRes] = await Promise.all([usersAPI.dashboard(), projectsAPI.list()]);
      setStats(dashRes.data);
      setProjects(projRes.data.projects);
    } catch (err) { console.error('Dashboard fetch error:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleTaskCreated = () => { fetchData(); };

  return (
    <div className="min-h-screen w-full p-7 bg-[#0a0a0a] text-white">
      <Header />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
        {[
          { label: 'Total Tasks', value: stats.taskCounts?.total || 0, color: 'bg-indigo-500/20 text-indigo-400' },
          { label: 'New', value: stats.taskCounts?.new || 0, color: 'bg-blue-500/20 text-blue-400' },
          { label: 'Active', value: stats.taskCounts?.active || 0, color: 'bg-yellow-500/20 text-yellow-400' },
          { label: 'Completed', value: stats.taskCounts?.completed || 0, color: 'bg-emerald-500/20 text-emerald-400' },
          { label: 'Failed', value: stats.taskCounts?.failed || 0, color: 'bg-red-500/20 text-red-400' },
          { label: 'Overdue', value: stats.taskCounts?.overdue || 0, color: 'bg-orange-500/20 text-orange-400' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs mt-1 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Nav */}
      <div className="flex gap-3 mt-6">
        <button onClick={() => navigate('/projects')} className="bg-[#141414] border border-gray-800 hover:border-emerald-600/40 text-white px-5 py-3 rounded-xl text-sm font-medium transition-all">
          📁 Projects ({stats.projectCount || 0})
        </button>
      </div>

      {/* Create Task */}
      <CreateTask projects={projects} onTaskCreated={handleTaskCreated} />

      {/* Recent Tasks */}
      <AllTask tasks={stats.recentTasks || []} onRefresh={fetchData} />
    </div>
  );
};

export default AdminDashboard;
