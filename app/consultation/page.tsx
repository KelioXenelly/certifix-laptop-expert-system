'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { buildRulePaths, inferNextStep, RulePath } from '@/lib/expertSystem/forwardChaining';
import { Rule, Symptom } from '@/types';
import { Button, CircularProgress, TextField, IconButton, Tooltip, Skeleton } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon, PersonOutlined as PersonOutlineIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { toast } from 'sonner';

export default function ConsultationPage() {
  const supabase = createClient();
  const router = useRouter();
  
  // States
  const [username, setUsername] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [rulePaths, setRulePaths] = useState<RulePath[]>([]);
  const [symptomsDict, setSymptomsDict] = useState<Record<string, Symptom>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, boolean>>({});
  
  const [currentSymptom, setCurrentSymptom] = useState<Symptom | null>(null);

  // Initialization
  useEffect(() => {
    async function loadKnowledgeBase() {
      // Fetch rules
      const { data: rulesData } = await supabase.from('rule').select('*');
      // Fetch symptoms
      const { data: symptomsData } = await supabase.from('symptom').select('*');

      if (rulesData && symptomsData) {
        setRulePaths(buildRulePaths(rulesData as Rule[]));
        
        const dict: Record<string, Symptom> = {};
        symptomsData.forEach((s: Symptom) => {
          dict[s.symptom_id] = s;
        });
        setSymptomsDict(dict);
      }
      setLoading(false);
    }
    loadKnowledgeBase();
  }, []);

  // Inference Engine Hook
  useEffect(() => {
    if (!hasStarted || rulePaths.length === 0) return;

    const result = inferNextStep(rulePaths, userAnswers);

    if (!result.isFinished && result.nextSymptomId) {
      setCurrentSymptom(symptomsDict[result.nextSymptomId]);
    } else if (result.isFinished) {
      finishConsultation(result.diagnosis);
    }
  }, [userAnswers, hasStarted, rulePaths, symptomsDict]);

  const handleAnswer = useCallback((answer: boolean) => {
    if (!currentSymptom) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentSymptom.symptom_id]: answer
    }));
  }, [currentSymptom]);

  // Keyboard Shortcuts (Y / T / Arrows)
  useEffect(() => {
    if (!hasStarted || !currentSymptom || processing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'y' || e.key === 'ArrowLeft') {
        handleAnswer(true);
      } else if (e.key.toLowerCase() === 't' || e.key === 'ArrowRight') {
        handleAnswer(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, currentSymptom, processing, handleAnswer]);

  const finishConsultation = async (diagnosis?: { damage_id: string, cf_percentage: number }) => {
    setProcessing(true);
    
    // Save to DB
    let diagnosed_damage = 'Unknown';
    let cf_percentage = 0;

    if (diagnosis) {
      const { data: damageData } = await supabase
        .from('damage')
        .select('damage_name')
        .eq('damage_id', diagnosis.damage_id)
        .single();
        
      diagnosed_damage = damageData?.damage_name || diagnosis.damage_id;
      cf_percentage = diagnosis.cf_percentage;
    }

    const { data: historyData } = await supabase.from('diagnosis_history').insert({
      username,
      diagnosed_damage,
      cf_percentage
    }).select().single();

    if (historyData) {
      router.push(`/consultation/result?id=${historyData.history_id}&damage_id=${diagnosis?.damage_id || 'NONE'}`);
    } else {
      // Fallback if save fails
      toast.error("Gagal menyimpan riwayat. Melanjutkan ke hasil.");
      router.push(`/consultation/result?damage_id=${diagnosis?.damage_id || 'NONE'}&cf=${cf_percentage}&user=${username}`);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-10 animate-fade-in w-full">
        <div className="flex flex-col items-center mb-8">
          <Skeleton variant="text" width="60%" height={40} className="bg-slate-700/50 mb-2" />
          <Skeleton variant="text" width="80%" height={24} className="bg-slate-700/50" />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton variant="rounded" width="100%" height={56} className="bg-slate-700/50 rounded-xl" />
          <Skeleton variant="rounded" width="100%" height={50} className="bg-sky-500/20 rounded-xl mt-4" />
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="glass-card p-10 animate-fade-in w-full">
        <h2 className="text-3xl font-heading font-bold mb-2 text-slate-100 text-center">Registrasi Pasien</h2>
        <p className="text-slate-400 text-center mb-8">Masukkan nama Anda untuk memulai sesi diagnosa.</p>
        
        <form 
          className="flex flex-col gap-6" 
          onSubmit={(e) => { 
            e.preventDefault(); 
            if (username.trim()) setHasStarted(true); 
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Masukkan nama lengkap Anda..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <PersonOutlineIcon className="text-slate-400 mr-2" />,
                className: "bg-slate-800/50 text-slate-100 rounded-xl"
              }
            }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0ea5e9' },
              '& input::placeholder': { color: '#94a3b8', opacity: 1 },
            }}
            fullWidth
            autoFocus
          />
          <Button 
            type="submit"
            variant="contained" 
            disabled={!username.trim()}
            className="bg-sky-500 hover:bg-sky-400 text-white py-3 rounded-xl font-bold shadow-lg shadow-sky-500/20 disabled:bg-slate-700 disabled:text-slate-500"
          >
            Mulai Diagnosa
          </Button>
        </form>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="glass-card p-12 flex flex-col items-center justify-center animate-fade-in text-center">
        <CircularProgress size={60} className="text-violet-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-100 font-heading mb-2">Menganalisis Jawaban...</h2>
        <p className="text-slate-400">Algoritma Decision Tree sedang menghitung hasil.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-10 animate-slide-up w-full flex flex-col items-center text-center">
      <div className="w-full flex justify-between items-center mb-8 border-b border-slate-700/50 pb-4">
        <span className="text-slate-400 text-sm">Pasien: <strong className="text-sky-400">{username}</strong></span>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">Engine: <strong className="text-violet-400">Forward Chaining</strong></span>
          <Tooltip title="Ulangi Kuesioner">
            <IconButton 
              size="small" 
              onClick={() => setUserAnswers({})}
              className="text-slate-400 hover:text-sky-400 bg-slate-800/50"
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <div className="min-h-40 flex items-center justify-center mb-10 w-full">
        {currentSymptom ? (
          <div className="flex flex-col items-center animate-fade-in">
            <span className="text-sky-400 font-bold mb-4 tracking-widest text-sm uppercase bg-sky-500/10 px-4 py-1.5 rounded-full border border-sky-500/20">
              Pertanyaan #{Object.keys(userAnswers).length + 1}
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-medium text-slate-100 leading-relaxed">
              {currentSymptom.question_text}
            </h2>
          </div>
        ) : (
          <CircularProgress className="text-sky-500" />
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Button 
          variant="contained" 
          startIcon={<CheckIcon />}
          onClick={() => handleAnswer(true)}
          disabled={processing}
          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white! py-4 rounded-xl text-lg font-bold shadow-lg shadow-emerald-500/20 group relative overflow-hidden disabled:opacity-50"
        >
          <span className="relative z-10">Ya, Benar</span>
          <span className="absolute bottom-2 right-4 text-[10px] opacity-50 font-normal hidden sm:block">Tekan 'Y' atau '←'</span>
        </Button>
        <Button 
          variant="contained" 
          startIcon={<CloseIcon />}
          onClick={() => handleAnswer(false)}
          disabled={processing}
          className="flex-1 bg-rose-500 hover:bg-rose-400 text-white! py-4 rounded-xl text-lg font-bold shadow-lg shadow-rose-500/20 group relative overflow-hidden disabled:opacity-50"
        >
          <span className="relative z-10">Tidak</span>
          <span className="absolute bottom-2 right-4 text-[10px] opacity-50 font-normal hidden sm:block">Tekan 'T' atau '→'</span>
        </Button>
      </div>
    </div>
  );
}
