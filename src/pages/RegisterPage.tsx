import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Mail, Lock, User, Loader2, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-[#1A1A1A] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full">
        {/* Branding header */}
        <div className="flex items-center justify-center gap-2 mb-8 text-[#5A5A40] dark:text-[#A8A880]">
          <Briefcase className="w-7 h-7" />
          <span className="font-serif text-2xl font-bold">InterviewPro</span>
        </div>

        <div className="bg-white dark:bg-[#141414] rounded-[32px] p-8 shadow-xl shadow-black/5 dark:shadow-white/5 border border-black/5 dark:border-white/5 transition-colors duration-300">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-[#5A5A40]/10 dark:bg-[#A8A880]/10 rounded-2xl flex items-center justify-center text-[#5A5A40] dark:text-[#A8A880] mb-4">
              <UserPlus className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#1A1A1A] dark:text-[#F5F5F0]">Create Account</h1>
            <p className="text-[#1A1A1A]/60 dark:text-[#F5F5F0]/60 mt-2">Start your journey to success</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]/60 dark:text-[#F5F5F0]/60 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/30 dark:text-[#F5F5F0]/30" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F5F5F0] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F5F5F0] border border-black/10 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#5A5A40] dark:focus:ring-[#A8A880] focus:border-transparent placeholder:text-[#1A1A1A]/30 dark:placeholder:text-[#F5F5F0]/30 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]/60 dark:text-[#F5F5F0]/60 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/30 dark:text-[#F5F5F0]/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F5F5F0] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F5F5F0] border border-black/10 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#5A5A40] dark:focus:ring-[#A8A880] focus:border-transparent placeholder:text-[#1A1A1A]/30 dark:placeholder:text-[#F5F5F0]/30 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]/60 dark:text-[#F5F5F0]/60 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/30 dark:text-[#F5F5F0]/30" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F5F5F0] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F5F5F0] border border-black/10 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#5A5A40] dark:focus:ring-[#A8A880] focus:border-transparent placeholder:text-[#1A1A1A]/30 dark:placeholder:text-[#F5F5F0]/30 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5A5A40] dark:bg-[#A8A880] text-white dark:text-[#1A1A1A] rounded-2xl py-4 font-bold hover:bg-[#4A4A30] dark:hover:bg-[#989870] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
            </button>
          </form>

          <p className="text-center mt-8 text-[#1A1A1A]/60 dark:text-[#F5F5F0]/60">
            Already have an account?{' '}
            <Link to="/login" className="text-[#5A5A40] dark:text-[#A8A880] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
