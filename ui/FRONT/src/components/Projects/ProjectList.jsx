import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';
import { projectsAPI } from '../../api/index';
import CreateProject from './CreateProject';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await projectsAPI.list();
      setProjects(res.data.projects);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
    setShowCreate(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    try {
      await projectsAPI.delete(id);
      setProjects(projects.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const statusColor = (status, count) => {
    if (count === 0) return 'text-gray-500';
    const colors = { new: 'text-blue-400', active: 'text-yellow-400', completed: 'text-emerald-400', failed: 'text-red-400' };
    return colors[status] || 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Nav */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold">
          <span className="text-emerald-400">📁</span> Projects
        </h1>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Dashboard
          </button>
          <span className="text-gray-500 text-sm">{user?.name}</span>
          <button onClick={logout} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Create Button (Admin) */}
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="mb-6 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
          >
            {showCreate ? '✕ Cancel' : '+ New Project'}
          </button>
        )}

        {/* Create Form */}
        {showCreate && <CreateProject onCreated={handleProjectCreated} />}

        {/* Project Grid */}
        {loading ? (
          <div className="text-center text-gray-500 py-20 text-lg animate-pulse">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-5xl mb-4">📂</p>
            <p className="text-lg">No projects yet</p>
            {user?.role === 'admin' && <p className="text-sm mt-2 text-gray-600">Create your first project above</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div key={project._id} className="bg-[#141414] border border-gray-800 rounded-2xl p-6 hover:border-emerald-600/40 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <Link to={`/projects/${project._id}`} className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {project.name}
                  </Link>
                  {user?.role === 'admin' && (
                    <button onClick={() => handleDelete(project._id)} className="text-gray-600 hover:text-red-400 text-sm transition-colors">
                      🗑️
                    </button>
                  )}
                </div>
                
                {project.description && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>
                )}

                {/* Task Stats */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {['new', 'active', 'completed', 'failed'].map(s => (
                    <div key={s} className="text-center">
                      <div className={`text-lg font-bold ${statusColor(s, project.taskCounts?.[s] || 0)}`}>
                        {project.taskCounts?.[s] || 0}
                      </div>
                      <div className="text-[10px] text-gray-600 uppercase">{s}</div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-800">
                  <span>👥 {project.members?.length || 0} members</span>
                  <span>{project.taskCounts?.total || 0} tasks</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectList;
