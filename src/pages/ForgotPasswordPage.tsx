import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ForgotPasswordPage: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast('Reset link sent! Check your inbox.', 'success');
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link to="/login" className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-stone-600" />
          </div>
          <h1 className="font-serif text-2xl font-light text-stone-900">Forgot Password?</h1>
          <p className="text-stone-500 text-sm mt-2">Enter your email and we'll send you a reset link.</p>
        </div>

        {sent ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-center">
            <p className="text-sm text-emerald-800 font-medium mb-1">Reset link sent!</p>
            <p className="text-xs text-emerald-600">Check your inbox at <strong>{email}</strong>. This is a demo — no email was actually sent.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
              className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-stone-400 transition-colors mb-4"
            />
            <button type="submit" className="w-full bg-stone-900 text-white py-3.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
