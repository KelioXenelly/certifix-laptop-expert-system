import Link from 'next/link';

export default function ConsultationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Global Back Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-sky-400 hover:bg-slate-800/50 transition-all z-50 font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span className="text-lg font-heading hidden md:block">Kembali ke Beranda</span>
      </Link>

      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="z-10 w-full max-w-3xl px-6 py-12">
        {children}
      </div>

      {/* Global Footer */}
      <footer className="w-full text-center py-6 text-slate-500 text-sm border-t border-white/5 mt-auto bg-slate-900/50 backdrop-blur-md z-10 relative">
        <p className="font-medium">
          &copy; {new Date().getFullYear()} <span className="text-slate-300 font-bold">CertiFix</span> Expert System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
