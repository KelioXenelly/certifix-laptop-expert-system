'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu as MenuIcon, 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  DashboardOutlined,
  BuildOutlined,
  BugReportOutlined,
  AccountTreeOutlined,
  AssessmentOutlined
} from '@mui/icons-material';
import ProfileDropdown from '@/components/ProfileDropdown';
import AdminThemeProvider from '@/components/AdminThemeProvider';
import AdminBodyStyler from '@/components/AdminBodyStyler';
import { IconButton, Tooltip } from '@mui/material';

export default function AdminSidebarLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: <DashboardOutlined /> },
    { name: 'Data Kerusakan', href: '/admin/damage', icon: <BuildOutlined /> },
    { name: 'Data Gejala', href: '/admin/symptom', icon: <BugReportOutlined /> },
    { name: 'Basis Pengetahuan', href: '/admin/rule', icon: <AccountTreeOutlined /> },
    { name: 'Riwayat Diagnosa', href: '/admin/history', icon: <AssessmentOutlined /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      <AdminBodyStyler />
      
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-slate-200 flex flex-col fixed h-full z-40 transition-all duration-300 ease-in-out shadow-xl lg:shadow-sm
          ${isCollapsed ? 'w-20' : 'w-64'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-20 border-b border-slate-100 flex items-center justify-center relative">
          {/* Logo */}
          <Link href="/admin" className={`flex items-center gap-3 ${isCollapsed ? 'px-0 justify-center' : 'w-full px-6'} text-slate-800 font-bold transition-all`}>
            <span className="bg-linear-to-br from-sky-500 to-indigo-600 text-white min-w-8 h-8 rounded-lg flex items-center justify-center font-heading shadow-md shadow-sky-500/20 text-lg">
              C
            </span>
            {!isCollapsed && <span className="text-xl whitespace-nowrap overflow-hidden">CertiFix Admin</span>}
          </Link>

          {/* Collapse Button (Desktop) */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-sky-500 hover:border-sky-200 shadow-sm transition-colors z-50 cursor-pointer"
          >
            {isCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </button>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
          {!isCollapsed && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-6 mt-2 whitespace-nowrap">Menu Utama</p>}
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip 
                key={item.href}
                title={item.name} 
                placement="right" 
                arrow 
                disableHoverListener={!isCollapsed}
                slotProps={{
                  tooltip: {
                    className: 'bg-slate-800 text-xs font-semibold py-1.5 px-3 rounded-lg shadow-xl ml-2'
                  },
                  arrow: {
                    className: 'text-slate-800'
                  }
                }}
              >
                <Link 
                  href={item.href} 
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-6 py-3.5 font-medium transition-colors mx-3 rounded-xl
                    ${isActive 
                      ? 'bg-sky-50 text-sky-700' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }
                    ${isCollapsed ? 'justify-center px-0 mx-2' : ''}
                  `}
                >
                  <div className={`${isActive ? 'text-sky-600' : 'text-slate-400'}`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </Link>
              </Tooltip>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-h-screen relative z-10 min-w-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden text-slate-500 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-lg transition-colors -ml-2"
            >
              <MenuIcon />
            </button>

            {/* Desktop Title */}
            <h2 className="text-xl font-bold text-slate-800 font-heading hidden lg:block">Knowledge Base Management</h2>
          </div>
          
          <ProfileDropdown />
        </header>
        <AdminThemeProvider>
          <div className="p-4 lg:p-8 flex-1 w-full max-w-full overflow-hidden">
            {children}
          </div>
        </AdminThemeProvider>
        
        <footer className="py-6 px-8 text-center text-sm text-slate-500 border-t border-slate-200/60 mt-auto">
          <p className="font-medium">
            &copy; {new Date().getFullYear()} <span className="text-slate-700 font-bold">CertiFix</span> Expert System. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
