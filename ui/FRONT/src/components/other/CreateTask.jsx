import React, { useState } from 'react';
import { tasksAPI } from '../../api/index';

function CreateTask({ projects, onTaskCreated }) {
  const [form, setForm] = useState({ title:'', description:'', project:'', assignedTo:'', priority:'medium', category:'', dueDate:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Get members of selected project
  const selectedProject = projects?.find(p => p._id === form.project);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await tasksAPI.create({
        ...form,
        assignedTo: form.assignedTo || undefined
      });
      setForm({ title:'', description:'', project:'', assignedTo:'', priority:'medium', category:'', dueDate:'' });
      setSuccess('Task created successfully!');
      if (onTaskCreated) onTaskCreated();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally { setLoading(false); }
  };

  return (
    <div className="p-5 bg-[#141414] border border-gray-800 mt-7 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">Create New Task</h3>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
      {success && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg mb-4 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="flex flex-wrap w-full items-start justify-between gap-y-4">
        <div className="w-1/2 pr-4 space-y-4">
          <div>
            <h3 className="text-sm text-gray-400 mb-1">Task Title</h3>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="text-sm py-2 px-3 w-4/5 rounded-lg outline-none bg-transparent border border-gray-700 text-gray-200 focus:border-emerald-500 transition-colors"
              placeholder="Enter task title" required />
          </div>
          <div>
            <h3 className="text-sm text-gray-400 mb-1">Project</h3>
            <select value={form.project} onChange={e => setForm({...form, project: e.target.value, assignedTo:''})}
              className="text-sm py-2 px-3 w-4/5 rounded-lg outline-none bg-[#1c1c1c] border border-gray-700 text-gray-200 focus:border-emerald-500 transition-colors" required>
              <option value="">Select project</option>
              {projects?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <h3 className="text-sm text-gray-400 mb-1">Assign To</h3>
            <select value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})}
              className="text-sm py-2 px-3 w-4/5 rounded-lg outline-none bg-[#1c1c1c] border border-gray-700 text-gray-200 focus:border-emerald-500 transition-colors">
              <option value="">Unassigned</option>
              {selectedProject?.members?.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
            </select>
          </div>
          <div className="flex gap-4 w-4/5">
            <div className="flex-1">
              <h3 className="text-sm text-gray-400 mb-1">Priority</h3>
              <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}
                className="text-sm py-2 px-3 w-full rounded-lg outline-none bg-[#1c1c1c] border border-gray-700 text-gray-200">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-gray-400 mb-1">Date</h3>
              <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})}
                className="text-sm py-2 px-3 w-full rounded-lg outline-none bg-[#1c1c1c] border border-gray-700 text-gray-200" required />
            </div>
          </div>
        </div>

        <div className="w-2/5 flex flex-col items-start space-y-4">
          <div className="w-full">
            <h3 className="text-sm text-gray-400 mb-1">Category</h3>
            <input value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              className="text-sm py-2 px-3 w-full rounded-lg outline-none bg-transparent border border-gray-700 text-gray-200 focus:border-emerald-500 transition-colors"
              placeholder="e.g. Design, Development" />
          </div>
          <div className="w-full">
            <h3 className="text-sm text-gray-400 mb-1">Description</h3>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="w-full h-32 text-sm py-2 px-3 rounded-lg outline-none bg-transparent border border-gray-700 text-gray-200 focus:border-emerald-500 transition-colors resize-none"
              placeholder="Write description here..." />
          </div>
          <button type="submit" disabled={loading}
            className="bg-emerald-600 py-3 px-6 rounded-xl hover:bg-emerald-500 transition-all text-white font-medium disabled:opacity-50">
            {loading ? 'Creating...' : 'Submit Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTask;