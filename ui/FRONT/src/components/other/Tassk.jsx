import React from 'react';
import { useAuth } from '../../Context/AuthProvider';

function Tassk({ tasks, onStatusChange }) {
  const { user } = useAuth();

  const priorityColors = {
    low: { bg: 'bg-blue-400', card: 'bg-blue-500/10 border-blue-500/20' },
    medium: { bg: 'bg-yellow-400', card: 'bg-yellow-500/10 border-yellow-500/20' },
    high: { bg: 'bg-red-400', card: 'bg-red-500/10 border-red-500/20' },
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="mt-10 text-center text-gray-500 py-10">
        <p className="text-4xl mb-3">📋</p>
        <p>No tasks assigned to you</p>
      </div>
    );
  }

  return (
    <div id='taskid' className='h-[45vh] overflow-x-auto mt-8 flex items-start justify-start gap-5 flex-nowrap pb-4'>
      {tasks.map((task) => {
        const colors = priorityColors[task.priority] || priorityColors.medium;
        return (
          <div key={task._id} className={`flex-shrink-0 h-fit w-[280px] ${colors.card} border rounded-2xl p-5`}>
            <div className='flex justify-between items-center'>
              <span className={`${colors.bg} px-3 py-1 rounded-full text-xs font-medium text-black`}>
                {task.priority}
              </span>
              <span className='text-xs text-gray-400'>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>

            <h2 className='mt-4 text-lg font-semibold text-white'>{task.title}</h2>
            <p className='text-sm mt-2 text-gray-400 line-clamp-3'>{task.description || 'No description'}</p>
            
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">📂 {task.project?.name || 'N/A'}</span>
              {task.category && <span className="text-xs text-gray-500">• {task.category}</span>}
            </div>

            {task.isOverdue && (
              <div className="mt-2 text-orange-400 text-xs font-medium">⚠ Overdue!</div>
            )}

            {/* Status Actions */}
            <div className="mt-4 flex gap-2">
              {task.status === 'new' && (
                <button onClick={() => onStatusChange(task._id, 'active')}
                  className="flex-1 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 py-2 rounded-lg text-xs font-medium transition-all">
                  Accept Task
                </button>
              )}
              {task.status === 'active' && (
                <>
                  <button onClick={() => onStatusChange(task._id, 'completed')}
                    className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 py-2 rounded-lg text-xs font-medium transition-all">
                    Complete
                  </button>
                  <button onClick={() => onStatusChange(task._id, 'failed')}
                    className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 py-2 rounded-lg text-xs font-medium transition-all">
                    Failed
                  </button>
                </>
              )}
              {task.status === 'completed' && (
                <span className="text-emerald-400 text-xs font-medium">✓ Completed</span>
              )}
              {task.status === 'failed' && (
                <span className="text-red-400 text-xs font-medium">✗ Failed</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Tassk;