import React from 'react';
import { useAuth } from '../../Context/AuthProvider';
import { tasksAPI } from '../../api/index';

const statusColors = {
  new: 'bg-blue-500/20 text-blue-300',
  active: 'bg-yellow-500/20 text-yellow-300',
  completed: 'bg-emerald-500/20 text-emerald-300',
  failed: 'bg-red-500/20 text-red-300',
};

function AllTask({ tasks, onRefresh }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleStatusChange = async (taskId, status) => {
    try {
      await tasksAPI.update(taskId, { status });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <div className='bg-[#141414] border border-gray-800 p-5 mt-5 rounded-2xl'>
      <h3 className="text-lg font-semibold text-white mb-3">Recent Tasks</h3>
      
      {(!tasks || tasks.length === 0) ? (
        <p className="text-gray-500 text-sm text-center py-6">No tasks yet</p>
      ) : (
        <div className="max-h-64 overflow-auto space-y-2 scrollbar-hide">
          {tasks.map((task, idx) => {
            const bgColors = ['bg-red-500/10','bg-pink-500/10','bg-yellow-500/10','bg-emerald-500/10','bg-blue-500/10','bg-indigo-500/10'];
            return (
              <div key={task._id || idx} className={`${bgColors[idx % bgColors.length]} py-3 px-4 flex items-center justify-between rounded-xl`}>
                <div className="flex-1">
                  <h2 className='text-sm font-medium text-white'>{task.assignedTo?.name || 'Unassigned'}</h2>
                  <p className="text-xs text-gray-400">{task.project?.name}</p>
                </div>
                <h3 className='text-sm text-gray-300 flex-1 text-center'>{task.title}</h3>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[task.status]}`}>
                    {task.status}
                  </span>
                  {task.isOverdue && (
                    <span className="text-orange-400 text-xs font-medium">⚠ Overdue</span>
                  )}
                  {isAdmin && task.status === 'new' && (
                    <button onClick={() => handleStatusChange(task._id, 'active')} className="text-yellow-400 text-xs hover:underline ml-2">Activate</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AllTask;