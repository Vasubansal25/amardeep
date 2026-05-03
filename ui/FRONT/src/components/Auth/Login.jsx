import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#0a0a0a]">
      <div className="border border-emerald-600/30 p-12 rounded-2xl shadow-2xl shadow-emerald-900/20 bg-[#111111] backdrop-blur-sm">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Sign in to your task manager</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="flex flex-col items-center justify-center space-y-5 w-80">
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
            placeholder="Enter your password"
            required
          />

          <button
            disabled={isLoading}
            className="w-full bg-emerald-600 rounded-full py-3 text-lg text-white hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
