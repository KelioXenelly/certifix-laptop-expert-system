'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import { Damage } from '@/types';

function ResultContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const historyId = searchParams.get('id');
  const fallbackDamageId = searchParams.get('damage_id');
  const fallbackCf = searchParams.get('cf');
  const fallbackUser = searchParams.get('user');

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    username: string;
    cf_percentage: number;
    damage?: Damage;
  } | null>(null);

  useEffect(() => {
    async function fetchResult() {
      if (historyId) {
        // Ambil dari DB jika berhasil simpan
        const { data: historyData } = await supabase
          .from('diagnosis_history')
          .select('*')
          .eq('history_id', historyId)
          .single();

        if (historyData) {
          // Cari detail kerusakan berdasarkan ID dari URL jika ada (lebih aman), fallback ke nama
          let damageData = null;
          if (fallbackDamageId && fallbackDamageId !== 'NONE') {
            const { data } = await supabase
              .from('damage')
              .select('*')
              .eq('damage_id', fallbackDamageId)
              .single();
            damageData = data;
          } else {
            const { data } = await supabase
              .from('damage')
              .select('*')
              .eq('damage_name', historyData.diagnosed_damage)
              .single();
            damageData = data;
          }

          setResult({
            username: historyData.username,
            cf_percentage: historyData.cf_percentage,
            damage: damageData || undefined
          });
        }
      } else if (fallbackDamageId && fallbackDamageId !== 'NONE') {
        // Gunakan fallback
        const { data: damageData } = await supabase
          .from('damage')
          .select('*')
          .eq('damage_id', fallbackDamageId)
          .single();

        setResult({
          username: fallbackUser || 'Pengguna',
          cf_percentage: parseFloat(fallbackCf || '0'),
          damage: damageData || undefined
        });
      } else {
        // NONE (Sehat / Tidak Terdiagnosa)
        setResult({
          username: fallbackUser || 'Pengguna',
          cf_percentage: 0,
        });
      }
      setLoading(false);
    }

    fetchResult();
  }, [historyId, fallbackDamageId, fallbackCf, fallbackUser]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <CircularProgress className="text-violet-500 mb-4" />
        <p className="text-slate-400 animate-pulse">Memuat Hasil Diagnosa...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-card p-10 text-center animate-fade-in w-full">
        <h2 className="text-2xl font-bold text-rose-400 mb-4">Hasil Tidak Ditemukan</h2>
        <Button variant="contained" onClick={() => router.push('/consultation')} className="bg-slate-700">
          Kembali
        </Button>
      </div>
    );
  }

  const isHealthy = !result.damage || result.cf_percentage === 0;

  return (
    <div className="glass-card p-10 animate-slide-up w-full flex flex-col items-center text-center relative overflow-hidden">
      
      {/* Confetti / Glow effect based on result */}
      <div className={`absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full blur-[80px] pointer-events-none ${isHealthy ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}></div>

      <div className="mb-6">
        <CheckCircleIcon className={`text-6xl ${isHealthy ? 'text-emerald-400' : 'text-sky-400'} animate-fade-in`} />
      </div>
      
      <h2 className="text-sm font-semibold tracking-widest text-slate-400 uppercase mb-2">Laporan Hasil Diagnosa</h2>
      <h1 className="text-3xl font-heading font-bold text-slate-100 mb-8">
        Pasien: <span className="text-violet-400">{result.username}</span>
      </h1>

      <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 w-full mb-8 shadow-inner">
        {isHealthy ? (
          <>
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">Tidak Ditemukan Kerusakan Fatal</h3>
            <p className="text-slate-300">Berdasarkan jawaban Anda, laptop Anda tidak terindikasi mengalami kerusakan yang terdaftar dalam sistem pakar kami.</p>
          </>
        ) : (
          <>
            <p className="text-slate-400 text-sm mb-1">Terdiagnosa Mengalami:</p>
            <h3 className="text-2xl md:text-3xl font-black text-rose-400 mb-4">{result.damage!.damage_name}</h3>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden max-w-xs">
                <div 
                  className="h-full bg-linear-to-r from-rose-500 to-orange-400 transition-all duration-1000" 
                  style={{ width: `${result.cf_percentage}%` }}
                ></div>
              </div>
              <span className="font-bold text-xl text-slate-200">{result.cf_percentage}%</span>
            </div>

            <div className="text-left bg-slate-800/80 p-5 rounded-xl border border-slate-600/50">
              <h4 className="text-sky-400 font-bold mb-2 flex items-center gap-2">
                <CheckCircleIcon fontSize="small" /> Solusi Pakar:
              </h4>
              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                {result.damage!.solution}
              </p>
            </div>
          </>
        )}
      </div>

      <Button 
        variant="contained" 
        startIcon={<ReplayIcon />}
        onClick={() => router.push('/consultation')}
        className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-8 rounded-xl font-bold transition-all shadow-md"
      >
        Lakukan Diagnosa Ulang
      </Button>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <CircularProgress className="text-violet-500 mb-4" />
        <p className="text-slate-400 animate-pulse">Memuat Hasil Diagnosa...</p>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
