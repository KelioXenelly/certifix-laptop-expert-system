'use client';

import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { toast } from 'sonner';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { createClient } from '@/utils/supabase/client';

export default function ProfileSettings() {
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [userData, setUserData] = useState({ fullName: '', email: '' });
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData({
          email: user.email || '',
          fullName: user.user_metadata?.full_name || 'Administrator',
        });
      }
      setInitialLoad(false);
    };
    fetchUser();
  }, [supabase]);

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const form = new FormData(e.currentTarget);
    const fullName = form.get('fullName') as string;
    
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });
    
    setLoading(false);
    
    if (error) {
      toast.error('Gagal memperbarui profil: ' + error.message);
    } else {
      toast.success('Profil berhasil diperbarui!');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = new FormData(e.currentTarget);
    const currentPassword = form.get('currentPassword') as string;
    const newPassword = form.get('newPassword') as string;
    const confirmPassword = form.get('confirmPassword') as string;
    
    if (!currentPassword) {
      toast.error('Kata sandi saat ini harus diisi!');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Kata sandi baru tidak cocok dengan konfirmasi!');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Kata sandi minimal 6 karakter.');
      return;
    }

    setLoading(true);
    
    // Verifikasi kata sandi lama
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: currentPassword,
    });
    
    if (signInError) {
      setLoading(false);
      toast.error('Kata sandi saat ini salah!');
      return;
    }
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    setLoading(false);
    
    if (error) {
      toast.error('Gagal memperbarui kata sandi: ' + error.message);
    } else {
      toast.success('Kata sandi berhasil diperbarui!');
      e.currentTarget.reset();
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="animate-fade-in relative z-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 font-heading tracking-tight">Pengaturan Profil</h1>
        <p className="text-slate-500 mt-2">Kelola informasi akun dan pengaturan keamanan Anda.</p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Profile Information Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 font-heading">Informasi Profil</h2>
            <p className="text-sm text-slate-500 mt-1">Perbarui informasi profil dan alamat email akun Anda.</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
              {/* Full Name */}
              <div className="flex flex-col gap-2 max-w-md">
                <label htmlFor="fullName" className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                {initialLoad ? (
                  <div className="w-full h-10.5 rounded-xl bg-slate-100 animate-pulse" />
                ) : (
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={userData.fullName}
                    onChange={(e) => setUserData({...userData, fullName: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all bg-white"
                  />
                )}
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-2 max-w-md">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700">Alamat Email (Tidak dapat diubah)</label>
                {initialLoad ? (
                  <div className="w-full h-10.5 rounded-xl bg-slate-100 animate-pulse" />
                ) : (
                  <input
                    id="email"
                    name="email"
                    type="email"
                    disabled
                    value={userData.email}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-500 text-sm bg-slate-50 opacity-80 cursor-not-allowed"
                  />
                )}
              </div>

              <div className="pt-2">
                <Button 
                  type="submit"
                  variant="contained" 
                  disabled={loading || initialLoad}
                  className="bg-slate-800 hover:bg-slate-900 text-white! rounded-xl shadow-md normal-case font-medium px-6 py-2 transition-all disabled:opacity-70"
                >
                  {loading ? <span className="animate-spin mr-2 border-2 border-white/20 border-t-white rounded-full w-4 h-4"></span> : null}
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Update Password Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 font-heading">Perbarui Kata Sandi</h2>
            <p className="text-sm text-slate-500 mt-1">Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-6">
              
              {/* Current Password */}
              <div className="flex flex-col gap-2 max-w-md relative">
                <label htmlFor="currentPassword" className="text-sm font-semibold text-slate-700">Kata Sandi Saat Ini</label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPassword.current ? 'text' : 'password'}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-10 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword.current ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-2 max-w-md relative">
                <label htmlFor="newPassword" className="text-sm font-semibold text-slate-700">Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword.new ? 'text' : 'password'}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-10 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword.new ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2 max-w-md relative">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">Konfirmasi Kata Sandi</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword.confirm ? 'text' : 'password'}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-10 text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword.confirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit"
                  variant="contained" 
                  disabled={loading}
                  className="bg-slate-800 hover:bg-slate-900 text-white! rounded-xl shadow-md normal-case font-medium px-6 py-2 transition-all disabled:opacity-70"
                >
                  {loading ? <span className="animate-spin mr-2 border-2 border-white/20 border-t-white rounded-full w-4 h-4"></span> : null}
                  Perbarui Kata Sandi
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
