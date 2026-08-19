import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const SignUpPage: React.FC = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    showToast('Account created! Welcome to VELORA.', 'success');
  };

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/">
            <span className="font-serif text-4xl font-light tracking-[0.3em] text-stone-900">VELORA</span>
          </Link>
          <h1 className="font-serif text-2xl font-light text-stone-800 mt-4">Create an account</h1>
          <p className="text-stone-500 text-sm mt-1">Join the VELORA community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: 'name', label: 'Full Name', type: 'text', key: 'name' as const, placeholder: 'Jane Smith' },
            { id: 'email', label: 'Email Address', type: 'email', key: 'email' as const, placeholder: 'jane@example.com' },
          ].map(f => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block text-xs font-medium text-stone-700 mb-1">{f.label}</label>
              <input id={f.id} type={f.type} value={form[f.key]} onChange={update(f.key)} placeholder={f.placeholder} required className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-stone-400 transition-colors" />
            </div>
          ))}

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-stone-700 mb-1">Password</label>
            <div className="relative">
              <input id="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={update('password')} placeholder="Min. 8 characters" required minLength={8} className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-stone-400 transition-colors pr-10" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600" aria-label="Toggle password">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm" className="block text-xs font-medium text-stone-700 mb-1">Confirm Password</label>
            <input id="confirm" type="password" value={form.confirm} onChange={update('confirm')} placeholder="Repeat password" required className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-stone-400 transition-colors" />
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-3.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
            <UserPlus size={15} /> Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{' '}
          <Link to="/login" className="text-stone-900 font-medium hover:underline underline-offset-2">Sign in</Link>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
