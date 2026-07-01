'use client';

import { toast } from 'sonner';
import { logout } from '@/app/admin/actions';

export default function LogoutButton() {
  const handleLogout = async () => {
    toast.success('Berhasil keluar dari sistem.');
    await logout();
  };

  return (
    <button 
      onClick={handleLogout} 
      className="w-full px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl font-medium transition-all text-left flex items-center gap-2"
    >
      Keluar Sistem
    </button>
  );
}
