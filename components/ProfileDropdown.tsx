'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { logout } from '@/app/admin/actions';
import { KeyboardArrowDown, LogoutOutlined, PersonOutlined } from '@mui/icons-material';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState({ fullName: '', email: '', initials: 'AD' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async (userSession?: any) => {
      const user = userSession || (await supabase.auth.getUser()).data.user;
      if (user) {
        const fullName = user.user_metadata?.full_name || 'Administrator';
        const email = user.email || '';
        
        // Generate initials
        const names = fullName.split(' ');
        const initials = names.length > 1 
          ? `${names[0][0]}${names[1][0]}`.toUpperCase()
          : fullName.substring(0, 2).toUpperCase();

        setUserData({ fullName, email, initials });
      }
      setLoading(false);
    };
    fetchUser();

    // Dengarkan perubahan profil (misal setelah updateUser)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED' || event === 'SIGNED_IN') {
        fetchUser(session?.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    toast.success('Berhasil keluar dari sistem.');
    await logout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-slate-100 p-1.5 pr-2 sm:pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200 focus:outline-none max-w-xs"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer shrink-0">
          {userData.initials}
        </div>
        <div className="text-left hidden sm:flex flex-col min-w-0 flex-1 justify-center">
          {loading ? (
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-24 bg-slate-200 rounded-md animate-pulse"></div>
              <div className="h-2.5 w-32 bg-slate-200 rounded-md animate-pulse"></div>
            </div>
          ) : (
            <>
              <p className="text-sm font-bold text-slate-800 leading-none truncate">{userData.fullName}</p>
              <p className="text-xs text-slate-500 mt-1.5 leading-none font-medium truncate">{userData.email}</p>
            </>
          )}
        </div>
        <KeyboardArrowDown className={`text-slate-400 transition-transform hidden sm:block shrink-0 ${isOpen ? 'rotate-180' : ''}`} fontSize="small" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fade-in origin-top-right z-50">
          <div className="p-1.5 flex flex-col gap-1">
            <Link 
              href="/admin/profile"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              <PersonOutlined fontSize="small" />
              <span>Profil Anda</span>
            </Link>
            
            <div className="h-px bg-slate-100 my-0.5 mx-2"></div>
            
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors text-left"
            >
              <LogoutOutlined fontSize="small" />
              <span>Keluar Sistem</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
