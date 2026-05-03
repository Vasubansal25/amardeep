import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';
import { projectsAPI, tasksAPI } from '../../api/index';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberError, setMemberError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title:'', description:'', assignedTo:'', priority:'medium', category:'', dueDate:'' });
  const [taskError, setTaskError] = useState('');

  const fetchProject = async () => {
    try {
      const res = await projectsAPI.get(id);
      setProject(res.data.project);
      setTasks(res.data.tasks);
    } catch (err) {
      if (err.response?.status === 404) navigate('/projects');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProject(); }, [id]);

  const handleAddMember = async (e) => {
    e.preventDefault(); setMemberError('');
    try {
      const res = await projectsAPI.addMember(id, memberEmail);
      setProject(p => ({...p, members: res.data.project.members}));
      setMemberEmail('');
    } catch (err) { setMemberError(err.response?.data?.message || 'Failed'); }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Remove this member?')) return;
    try {
      const res = await projectsAPI.removeMember(id, userId);
      setProject(p => ({...p, members: res.data.project.members}));
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault(); setTaskError('');
    try {
      const res = await tasksAPI.create({...taskForm, project: id, assignedTo: taskForm.assignedTo || undefined});
      setTasks([res.data.task, ...tasks]);
      setTaskForm({ title:'', description:'', assignedTo:'', priority:'medium', category:'', dueDate:'' });
      setShowTaskForm(false);
    } catch (err) { setTaskError(err.response?.data?.message || 'Failed'); }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const res = await tasksAPI.update(taskId, { status });
      setTasks(tasks.map(t => t._id === taskId ? res.data.task : t));
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try { await tasksAPI.delete(taskId); setTasks(tasks.filter(t => t._id !== taskId)); }
    catch (err) { alert('Failed to delete'); }
  };

  const pColors = { low:'bg-blue-500/20 text-blue-400', medium:'bg-yellow-500/20 text-yellow-400', high:'bg-red-500/20 text-red-400' };
  const sColors = { new:'bg-blue-500/20 text-blue-400', active:'bg-yellow-500/20 text-yellow-400', completed:'bg-emerald-500/20 text-emerald-400', failed:'bg-red-500/20 text-red-400' };

  if (loading) return <div className="flex items-center justify-center h-screen bg-[#0a0a0a]"><div className="text-emerald-400 text-xl animate-pulse">Loading...</div></div>;
  if (!project) return null;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/projects')} className="text-gray-400 hover:text-white text-sm">← Projects</button>
          <h1 className="text-2xl font-bold">{project.name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white text-sm">Dashboard</button>
          <button onClick={logout} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-medium">Logout</button>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Tasks ({tasks.length})</h2>
            {isAdmin && <button onClick={() => setShowTaskForm(!showTaskForm)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-medium">{showTaskForm ? '✕ Cancel' : '+ New Task'}</button>}
          </div>

          {showTaskForm && (
            <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 mb-6">
              {taskError && <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{taskError}</div>}
              <form onSubmit={handleCreateTask} className="grid grid-cols-2 gap-4">
                <input value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="col-span-2 bg-transparent border border-gray-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500" placeholder="Task title" required />
                <textarea value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} className="col-span-2 bg-transparent border border-gray-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500 h-20 resize-none" placeholder="Description" />
                <select value={taskForm.assignedTo} onChange={e => setTaskForm({...taskForm, assignedTo: e.target.value})} className="bg-[#1c1c1c] border border-gray-700 rounded-xl py-3 px-4 text-white outline-none">
                  <option value="">Unassigned</option>
                  {project.members?.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
                <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})} className="bg-[#1c1c1c] border border-gray-700 rounded-xl py-3 px-4 text-white outline-none">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
                <input value={taskForm.category} onChange={e => setTaskForm({...taskForm, category: e.target.value})} className="bg-transparent border border-gray-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 outline-none" placeholder="Category" />
                <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} className="bg-[#1c1c1c] border border-gray-700 rounded-xl py-3 px-4 text-white outline-none" required />
                <button type="submit" className="col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-medium">Create Task</button>
              </form>
            </div>
          )}

          {tasks.length === 0 ? <div className="text-center text-gray-500 py-16"><p className="text-4xl mb-3">📋</p><p>No tasks yet</p></div> : (
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task._id} className="bg-[#141414] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{task.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${pColors[task.priority]}`}>{task.priority}</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${sColors[task.status]}`}>{task.status}</span>
                    </div>
                  </div>
                  {task.description && <p className="text-gray-500 text-sm mb-3">{task.description}</p>}
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-4">
                      <span>👤 {task.assignedTo?.name || 'Unassigned'}</span>
                      <span className={task.isOverdue ? 'text-red-400 font-medium' : ''}>📅 {new Date(task.dueDate).toLocaleDateString()}{task.isOverdue && ' (Overdue!)'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(isAdmin || task.assignedTo?._id === user?._id) && task.status !== 'completed' && (<>
                        {task.status === 'new' && <button onClick={() => handleStatusChange(task._id, 'active')} className="text-yellow-400 hover:bg-yellow-500/20 px-2 py-1 rounded text-xs">Accept</button>}
                        {task.status === 'active' && (<><button onClick={() => handleStatusChange(task._id, 'completed')} className="text-emerald-400 hover:bg-emerald-500/20 px-2 py-1 rounded text-xs">Complete</button><button onClick={() => handleStatusChange(task._id, 'failed')} className="text-red-400 hover:bg-red-500/20 px-2 py-1 rounded text-xs">Failed</button></>)}
                      </>)}
                      {isAdmin && <button onClick={() => handleDeleteTask(task._id)} className="text-gray-600 hover:text-red-400 text-xs">🗑️</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3">Project Info</h3>
            <p className="text-gray-400 text-sm mb-4">{project.description || 'No description'}</p>
            <p className="text-xs text-gray-600">Owner: {project.owner?.name}</p>
            <p className="text-xs text-gray-600">Created: {new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Members ({project.members?.length || 0})</h3>
            {isAdmin && (
              <form onSubmit={handleAddMember} className="mb-4">
                {memberError && <div className="text-red-400 text-xs mb-2">{memberError}</div>}
                <div className="flex gap-2">
                  <input value={memberEmail} onChange={e => setMemberEmail(e.target.value)} className="flex-1 bg-transparent border border-gray-700 rounded-lg py-2 px-3 text-white text-sm placeholder:text-gray-600 outline-none" placeholder="User email" type="email" required />
                  <button type="submit" className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm">Add</button>
                </div>
              </form>
            )}
            <div className="space-y-2">
              {project.members?.map(m => (
                <div key={m._id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5">
                  <div><div className="text-sm font-medium">{m.name}</div><div className="text-xs text-gray-600">{m.email}</div></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{m.role}</span>
                    {isAdmin && m._id !== user?._id && <button onClick={() => handleRemoveMember(m._id)} className="text-gray-600 hover:text-red-400 text-xs">✕</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
