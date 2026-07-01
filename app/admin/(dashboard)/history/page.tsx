'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { TextField, Skeleton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface DiagnosisHistory {
  history_id: string;
  created_at: string;
  username: string;
  diagnosed_damage: string;
  cf_percentage: number;
}

export default function HistoryManagement() {
  const supabase = createClient();
  const [history, setHistory] = useState<DiagnosisHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof DiagnosisHistory; direction: 'asc' | 'desc' } | null>({ key: 'created_at', direction: 'desc' });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const { data } = await supabase.from('diagnosis_history').select('*');
    if (data) setHistory(data as DiagnosisHistory[]);
    setLoading(false);
  };

  const filteredHistory = useMemo(() => {
    let result = history;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(h => 
        (h.username && h.username.toLowerCase().includes(lower)) || 
        (h.diagnosed_damage && h.diagnosed_damage.toLowerCase().includes(lower))
      );
    }

    if (sortConfig !== null) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [history, searchTerm, sortConfig]);

  const requestSort = (key: keyof DiagnosisHistory) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="animate-fade-in relative z-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-heading tracking-tight">Riwayat Diagnosa</h1>
          <p className="text-sm text-slate-500 mt-1">Daftar riwayat konsultasi dan hasil diagnosa pengguna.</p>
        </div>
        <div className="flex gap-3">
          <TextField
            placeholder="Cari pasien / hasil..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <SearchIcon className="text-slate-400 mr-2" fontSize="small" />,
                className: "bg-white rounded-xl min-w-[250px]"
              }
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-150">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <th 
                className="px-6 py-4 font-semibold uppercase tracking-wider text-xs w-48 cursor-pointer hover:bg-slate-100 select-none transition-colors"
                onClick={() => requestSort('created_at')}
              >
                Tanggal {sortConfig?.key === 'created_at' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th 
                className="px-6 py-4 font-semibold uppercase tracking-wider text-xs w-1/4 cursor-pointer hover:bg-slate-100 select-none transition-colors"
                onClick={() => requestSort('username')}
              >
                Nama Pasien {sortConfig?.key === 'username' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th 
                className="px-6 py-4 font-semibold uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 select-none transition-colors"
                onClick={() => requestSort('diagnosed_damage')}
              >
                Hasil Diagnosa {sortConfig?.key === 'diagnosed_damage' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th 
                className="px-6 py-4 font-semibold uppercase tracking-wider text-xs w-32 cursor-pointer hover:bg-slate-100 select-none transition-colors"
                onClick={() => requestSort('cf_percentage')}
              >
                Certainty Factor {sortConfig?.key === 'cf_percentage' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={`skeleton-${i}`} className="border-b border-slate-100">
                  <td className="px-6 py-4"><Skeleton variant="text" width="80%" height={24} /></td>
                  <td className="px-6 py-4"><Skeleton variant="text" width="70%" height={24} /></td>
                  <td className="px-6 py-4"><Skeleton variant="text" width="90%" height={24} /></td>
                  <td className="px-6 py-4"><Skeleton variant="text" width="50%" height={24} /></td>
                </tr>
              ))
            ) : filteredHistory.map((row) => (
              <tr key={row.history_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-600">
                  {new Date(row.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4 text-slate-800 font-bold">{row.username}</td>
                <td className="px-6 py-4 text-slate-600">{row.diagnosed_damage}</td>
                <td className={`px-6 py-4 font-bold ${row.cf_percentage > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {row.cf_percentage}%
                </td>
              </tr>
            ))}
            {filteredHistory.length === 0 && !loading && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">Belum ada riwayat diagnosa atau pencarian tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
