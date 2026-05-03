import React from 'react';

function Tasklist({ data }) {
  const counts = data || { new: 0, completed: 0, active: 0, failed: 0, overdue: 0 };

  return (
    <div className='flex mt-6 justify-between gap-4 flex-wrap'>
      <div className='flex-1 min-w-[140px] bg-blue-500/15 border border-blue-500/20 py-5 px-6 rounded-xl'>
        <h2 className='text-3xl font-bold text-blue-400'>{counts.new || 0}</h2>
        <h3 className='text-sm font-medium text-blue-300/70 mt-1'>New Tasks</h3>
      </div>
      <div className='flex-1 min-w-[140px] bg-emerald-500/15 border border-emerald-500/20 py-5 px-6 rounded-xl'>
        <h2 className='text-3xl font-bold text-emerald-400'>{counts.completed || 0}</h2>
        <h3 className='text-sm font-medium text-emerald-300/70 mt-1'>Completed</h3>
      </div>
      <div className='flex-1 min-w-[140px] bg-yellow-500/15 border border-yellow-500/20 py-5 px-6 rounded-xl'>
        <h2 className='text-3xl font-bold text-yellow-400'>{counts.active || 0}</h2>
        <h3 className='text-sm font-medium text-yellow-300/70 mt-1'>Active</h3>
      </div>
      <div className='flex-1 min-w-[140px] bg-red-500/15 border border-red-500/20 py-5 px-6 rounded-xl'>
        <h2 className='text-3xl font-bold text-red-400'>{counts.failed || 0}</h2>
        <h3 className='text-sm font-medium text-red-300/70 mt-1'>Failed</h3>
      </div>
      <div className='flex-1 min-w-[140px] bg-orange-500/15 border border-orange-500/20 py-5 px-6 rounded-xl'>
        <h2 className='text-3xl font-bold text-orange-400'>{counts.overdue || 0}</h2>
        <h3 className='text-sm font-medium text-orange-300/70 mt-1'>Overdue</h3>
      </div>
    </div>
  );
}

export default Tasklist;