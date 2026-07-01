'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { login } from './actions';
import AdminBodyStyler from '@/components/AdminBodyStyler';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success('Login berhasil! Memuat dashboard...');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      <AdminBodyStyler />
      {/* Background soft glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 w-full max-w-md border border-slate-100 relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-linear-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 mb-6">
            <span className="text-3xl font-bold text-white font-heading">C</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2 font-heading tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 text-sm">Masuk untuk mengelola Knowledge Base CertiFix</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Pakar</label>
            <input
              name="email"
              type="email"
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-800 bg-slate-50 disabled:opacity-50 placeholder:text-slate-400"
              placeholder="admin.certifix@gmail.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kata Sandi</label>
            <input
              name="password"
              type="password"
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-800 bg-slate-50 disabled:opacity-50 placeholder:text-slate-400"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-sky-500 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:from-sky-600 hover:to-indigo-700 transition-all mt-4 shadow-lg shadow-sky-500/20 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
