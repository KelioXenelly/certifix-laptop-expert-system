import Link from 'next/link';
import { Button } from '@mui/material';
import { Memory as MemoryIcon, CheckCircleOutlined as CheckCircleOutlineIcon } from '@mui/icons-material';
import AnalyticsIcon from '@mui/icons-material/Analytics';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-sky-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 container mx-auto px-6 py-20 flex flex-col items-center justify-center text-center grow">
        
        {/* Badge */}
        <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-800/80 border border-slate-700 text-sky-400 text-sm font-medium mb-6 backdrop-blur-sm shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
            </span>
            Sistem Pakar Diagnosa Laptop
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 animate-slide-up opacity-0 font-heading" style={{ animationDelay: '0.2s' }}>
          Selamat Datang di <br />
          <span className="text-gradient">CertiFix</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mb-10 animate-slide-up opacity-0 leading-relaxed" style={{ animationDelay: '0.3s' }}>
          Deteksi kerusakan perangkat keras laptop Anda dengan cepat dan akurat menggunakan penalaran 
          <span className="text-slate-200 font-semibold"> Forward Chaining</span> berbasis 
          <span className="text-slate-200 font-semibold"> Decision Tree</span> dan kalkulasi 
          <span className="text-slate-200 font-semibold"> Certainty Factor</span>.
        </p>

        {/* CTA Button */}
        <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.4s' }}>
          <Link 
            href="/consultation"
            className="inline-block bg-linear-to-r from-sky-500 to-violet-500 hover:from-sky-400 hover:to-violet-400 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-sky-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Mulai Konsultasi Gratis
          </Link>
        </div>

        {/* Features / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-5xl animate-slide-up opacity-0" style={{ animationDelay: '0.6s' }}>
          
          <div className="glass-card p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-6 text-sky-400">
              <MemoryIcon fontSize="large" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-slate-100">Analisis Mendalam</h3>
            <p className="text-slate-400">Menelusuri setiap gejala dengan struktur pohon keputusan (Decision Tree) yang efisien.</p>
          </div>

          <div className="glass-card p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6 text-violet-400">
              <AnalyticsIcon fontSize="large" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-slate-100">Certainty Factor</h3>
            <p className="text-slate-400">Menghasilkan nilai persentase keyakinan diagnostik berdasarkan pengetahuan pakar ahli.</p>
          </div>

          <div className="glass-card p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400">
              <CheckCircleOutlineIcon fontSize="large" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-slate-100">Solusi Instan</h3>
            <p className="text-slate-400">Dapatkan langsung panduan langkah pertama (solusi) untuk mengatasi masalah laptop Anda.</p>
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full text-center py-6 text-slate-500 text-sm border-t border-white/5 mt-auto bg-slate-900/50 backdrop-blur-md z-10 relative">
        <p className="font-medium">
          &copy; {new Date().getFullYear()} <span className="text-slate-300 font-bold">CertiFix</span> Expert System. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
