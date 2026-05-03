import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signup(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#0a0a0a]">
      <div className="border border-emerald-600/30 p-12 rounded-2xl shadow-2xl shadow-emerald-900/20 bg-[#111111] backdrop-blur-sm">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">Join your team's task manager</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="flex flex-col items-center justify-center space-y-4 w-80">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border text-white border-emerald-600/40 rounded-full py-3 px-5 text-lg bg-transparent placeholder:text-gray-500 outline-none focus:border-emerald-400 transition-colors"
            type="text"
            placeholder="Enter your name"
            required
            minLength={2}
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border text-white border-emerald-600/40 rounded-full py-3 px-5 text-lg bg-transparent placeholder:text-gray-500 outline-none focus:border-emerald-400 transition-colors"
            type="email"
            placeholder="Enter your email"
            required
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-white border border-emerald-600/40 rounded-full py-3 px-5 text-lg bg-transparent placeholder:text-gray-500 outline-none focus:border-emerald-400 transition-colors"
            type="password"
            placeholder="Password (min 6 characters)"
            required
            minLength={6}
          />

          {/* Role Selector */}
          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={() => setRole('member')}
              className={`flex-1 py-3 rounded-full text-sm font-medium transition-all border ${
                role === 'member'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
              }`}
            >
              👤 Member
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-3 rounded-full text-sm font-medium transition-all border ${
                role === 'admin'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
              }`}
            >
              🛡️ Admin
            </button>
          </div>

          <button
            disabled={isLoading}
            className="w-full bg-emerald-600 rounded-full py-3 text-lg text-white hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
