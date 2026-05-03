import React, { useState } from 'react';
import { projectsAPI } from '../../api/index';

function CreateProject({ onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await projectsAPI.create({ name, description });
      setName('');
      setDescription('');
      onCreated(res.data.project);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Create New Project</h3>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent border border-gray-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500 transition-colors"
          placeholder="Project name"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-transparent border border-gray-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500 transition-colors h-24 resize-none"
          placeholder="Project description (optional)"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 w-fit px-8"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}

export default CreateProject;
