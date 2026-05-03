import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';
import { usersAPI, tasksAPI } from '../../api/index';
import Header from '../other/Header';
import Tasklist from '../other/Tasklist';
import Tassk from '../other/Tassk';

function Employee() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ taskCounts: { new:0, active:0, completed:0, failed:0, overdue:0, total:0 }, recentTasks:[] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await usersAPI.dashboard();
      setStats(res.data);
    } catch (err) { console.error('Dashboard fetch error:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (taskId, status) => {
    try {
      await tasksAPI.update(taskId, { status });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Failed to update'); }
  };

  return (
    <div className='p-8 bg-[#0a0a0a] min-h-screen text-white w-full'>
      <Header />
      
      <button onClick={() => navigate('/projects')} className="mt-4 bg-[#141414] border border-gray-800 hover:border-emerald-600/40 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all">
        📁 My Projects
      </button>

      <Tasklist data={stats.taskCounts} />
      <Tassk tasks={stats.recentTasks || []} onStatusChange={handleStatusChange} />
    </div>
  );
}

export default Employee;