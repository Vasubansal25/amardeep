import React from 'react';
import { useAuth } from '../../Context/AuthProvider';

function Header() {
  const { user, logout } = useAuth();

  return (
    <div className='flex items-end justify-between'>
      <h1 className='text-3xl font-semibold'>
        Hello <br />
        <span className='font-bold text-4xl text-emerald-400'>{user?.name || 'User'}</span>
        <span className='text-sm text-gray-500 ml-3 font-normal'>({user?.role})</span>
      </h1>
      <button 
        onClick={logout}
        className='bg-red-500/20 text-red-400 hover:bg-red-500/30 px-5 py-3 text-sm font-medium rounded-xl transition-all'
      >
        Log Out
      </button>
    </div>
  );
}

export default Header;