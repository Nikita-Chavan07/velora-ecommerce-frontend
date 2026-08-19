import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const LoginPage: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Authentication is mocked – welcome to VELORA!', 'success');
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/">
            <span className="font-serif text-4xl font-light tracking-[0.3em] text-stone-900">VELORA</span>
          </Link>
          <h1 className="font-serif text-2xl font-light text-stone-800 mt-4">Welcome back</h1>
          <p className="text-stone-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
              className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-stone-400 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-stone-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-stone-400 transition-colors pr-10"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600" aria-label={showPass ? 'Hide password' : 'Show password'}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-3.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
            <Lock size={15} /> Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-stone-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-stone-900 font-medium hover:underline underline-offset-2">
              Create one
            </Link>
          </p>
        </div>

        <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-100 text-center">
          <p className="text-xs text-stone-400 flex items-center justify-center gap-1.5">
            <Lock size={10} /> This is a demo. No real authentication.
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
