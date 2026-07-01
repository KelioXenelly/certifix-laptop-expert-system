import { createClient } from '@/utils/supabase/server';

import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { count: damageCount } = await supabase.from('damage').select('*', { count: 'exact', head: true });
  const { count: symptomCount } = await supabase.from('symptom').select('*', { count: 'exact', head: true });
  const { data: rulesData } = await supabase.from('rule').select('rule_code');
  const ruleCount = rulesData ? new Set(rulesData.map(r => r.rule_code)).size : 0;
  const { count: historyCount } = await supabase.from('diagnosis_history').select('*', { count: 'exact', head: true });

  const { data: { user } } = await supabase.auth.getUser();
  const adminName = user?.user_metadata?.full_name || 'Administrator';

  const { data: recentHistory } = await supabase
    .from('diagnosis_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="animate-fade-in relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-heading tracking-tight">Ringkasan Dashboard</h1>
          <p className="text-slate-500 mt-2">Selamat datang kembali, <strong>{adminName}</strong>! Berikut ringkasan sistem hari ini.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1: Kerusakan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute inset-0 bg-linear-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col">
              <span className="text-slate-500 font-medium mb-2 text-sm">Total Kerusakan</span>
              <span className="text-4xl font-bold text-slate-800 font-heading">{damageCount || 0}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500">
              <BuildOutlinedIcon />
            </div>
          </div>
        </div>

        {/* Card 2: Gejala */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute inset-0 bg-linear-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col">
              <span className="text-slate-500 font-medium mb-2 text-sm">Total Gejala</span>
              <span className="text-4xl font-bold text-slate-800 font-heading">{symptomCount || 0}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <BugReportOutlinedIcon />
            </div>
          </div>
        </div>

        {/* Card 3: Rule */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute inset-0 bg-linear-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col">
              <span className="text-slate-500 font-medium mb-2 text-sm">Aturan Pakar (Rule)</span>
              <span className="text-4xl font-bold text-slate-800 font-heading">{ruleCount || 0}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <AccountTreeOutlinedIcon />
            </div>
          </div>
        </div>

        {/* Card 4: Diagnosa */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute inset-0 bg-linear-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col">
              <span className="text-slate-500 font-medium mb-2 text-sm">Total Diagnosa</span>
              <span className="text-4xl font-bold text-slate-800 font-heading">{historyCount || 0}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
              <AssessmentOutlinedIcon />
            </div>
          </div>
        </div>

      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-6 font-heading tracking-tight">Riwayat Konsultasi Terbaru</h2>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Tanggal</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Nama Pasien</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Hasil Diagnosa</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Certainty Factor</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {recentHistory && recentHistory.length > 0 ? (
              recentHistory.map((history) => (
                <tr key={history.history_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(history.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">{history.username}</td>
                  <td className="px-6 py-4 text-slate-600">{history.diagnosed_damage}</td>
                  <td className={`px-6 py-4 font-bold ${history.cf_percentage > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {history.cf_percentage}%
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">
                  Belum ada riwayat diagnosa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
