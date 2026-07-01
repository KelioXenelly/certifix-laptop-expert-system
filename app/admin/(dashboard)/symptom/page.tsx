'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Symptom } from '@/types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Skeleton, CircularProgress } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { toast } from 'sonner';

export default function SymptomManagement() {
  const supabase = createClient();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog State
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Symptom>>({ symptom_id: '', symptom_name: '', question_text: '' });
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [symptomToDelete, setSymptomToDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Search & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Symptom; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    setLoading(true);
    const { data } = await supabase.from('symptom').select('*').order('symptom_id');
    if (data) setSymptoms(data as Symptom[]);
    setLoading(false);
  };

  const filteredSymptoms = useMemo(() => {
    let result = symptoms;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.symptom_id.toLowerCase().includes(lower) || 
        s.symptom_name.toLowerCase().includes(lower) || 
        s.question_text.toLowerCase().includes(lower)
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
  }, [symptoms, searchTerm, sortConfig]);

  const requestSort = (key: keyof Symptom) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getNextSymptomCode = () => {
    if (symptoms.length === 0) return 'G001';
    
    const numbers = symptoms
      .map(s => parseInt(s.symptom_id.replace('G', '')))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);
      
    if (numbers.length === 0) return 'G001';
    
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] !== i + 1) {
        return `G${String(i + 1).padStart(3, '0')}`;
      }
    }
    
    return `G${String(numbers.length + 1).padStart(3, '0')}`;
  };

  const handleOpen = (symptom?: Symptom) => {
    if (symptom) {
      setIsEditing(true);
      setFormData(symptom);
    } else {
      setIsEditing(false);
      setFormData({ symptom_id: getNextSymptomCode(), symptom_name: '', question_text: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ symptom_id: '', symptom_name: '', question_text: '' });
  };

  const handleSave = async () => {
    if (!formData.symptom_name?.trim()) {
      toast.error('Nama Gejala tidak boleh kosong!');
      return;
    }
    if (!formData.question_text?.trim()) {
      toast.error('Pertanyaan tidak boleh kosong!');
      return;
    }

    setSaving(true);
    let error;

    if (isEditing) {
      const res = await supabase.from('symptom').update(formData).eq('symptom_id', formData.symptom_id);
      error = res.error;
    } else {
      const res = await supabase.from('symptom').insert([formData]);
      error = res.error;
    }

    setSaving(false);

    if (error) {
      toast.error(`Gagal ${isEditing ? 'mengubah' : 'menambah'} data: ${error.message}`);
    } else {
      toast.success(`Berhasil ${isEditing ? 'mengubah' : 'menambah'} data gejala!`);
      fetchSymptoms();
      handleClose();
    }
  };

  const confirmDelete = (id: string) => {
    setSymptomToDelete(id);
    setDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!symptomToDelete) return;
    setSaving(true);
    const { error } = await supabase.from('symptom').delete().eq('symptom_id', symptomToDelete);
    setSaving(false);

    if (error) {
      toast.error(`Gagal menghapus data: ${error.message}`);
    } else {
      toast.success('Berhasil menghapus data gejala!');
      fetchSymptoms();
      setDeleteDialogOpen(false);
      setSymptomToDelete(null);
    }
  };

  return (
    <div className="animate-fade-in relative z-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-heading tracking-tight">Master Data Gejala</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola daftar gejala dan teks pertanyaan kuesioner.</p>
        </div>
        <div className="flex gap-3">
          <TextField
            placeholder="Cari gejala..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <SearchIcon className="text-slate-400 mr-2" fontSize="small" />,
                className: "bg-white rounded-xl min-w-[200px]"
              }
            }}
          />
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpen()}
            className="bg-linear-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white! rounded-xl shadow-md shadow-sky-500/20 normal-case font-medium px-4 transition-all shrink-0"
          >
            Tambah Gejala
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-150">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <th 
                className="px-6 py-4 font-semibold uppercase tracking-wider text-xs w-32 cursor-pointer hover:bg-slate-100 select-none transition-colors"
                onClick={() => requestSort('symptom_id')}
              >
                Kode (ID) {sortConfig?.key === 'symptom_id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th 
                className="px-6 py-4 font-semibold uppercase tracking-wider text-xs w-1/4 cursor-pointer hover:bg-slate-100 select-none transition-colors"
                onClick={() => requestSort('symptom_name')}
              >
                Nama Gejala {sortConfig?.key === 'symptom_name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th 
                className="px-6 py-4 font-semibold uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 select-none transition-colors"
                onClick={() => requestSort('question_text')}
              >
                Teks Pertanyaan {sortConfig?.key === 'question_text' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs w-24 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={`skeleton-${i}`} className="border-b border-slate-100">
                  <td className="px-6 py-4"><Skeleton variant="text" width="60%" height={24} /></td>
                  <td className="px-6 py-4"><Skeleton variant="text" width="80%" height={24} /></td>
                  <td className="px-6 py-4"><Skeleton variant="text" width="90%" height={24} /></td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <Skeleton variant="circular" width={28} height={28} />
                    <Skeleton variant="circular" width={28} height={28} />
                  </td>
                </tr>
              ))
            ) : filteredSymptoms.map((row) => (
              <tr key={row.symptom_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-sky-600">{row.symptom_id}</td>
                <td className="px-6 py-4 text-slate-800 font-medium">{row.symptom_name}</td>
                <td className="px-6 py-4 text-slate-600">{row.question_text}</td>
                <td className="px-6 py-4 flex justify-center gap-1">
                  <IconButton size="small" onClick={() => handleOpen(row)} className="text-sky-600 hover:bg-sky-50">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => confirmDelete(row.symptom_id)} className="text-rose-600 hover:bg-rose-50">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </td>
              </tr>
            ))}
            {filteredSymptoms.length === 0 && !loading && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">Belum ada data gejala atau pencarian tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth slotProps={{ paper: { className: 'rounded-2xl' } }}>
        <DialogTitle className="font-bold text-slate-800 border-b border-slate-100 pb-4">
          {isEditing ? 'Ubah Data Gejala' : 'Tambah Gejala Baru'}
        </DialogTitle>
        <DialogContent className="flex flex-col gap-5 pt-6!">
          <TextField
            label="Kode Gejala (Contoh: G001)"
            value={formData.symptom_id}
            onChange={(e) => setFormData({ ...formData, symptom_id: e.target.value })}
            disabled={true}
            fullWidth
            size="small"
            className="mt-2"
            helperText="Kode ID dibuat otomatis oleh sistem dan tidak dapat diubah."
          />
          <TextField
            label="Deskripsi Gejala (Singkat)"
            value={formData.symptom_name}
            onChange={(e) => setFormData({ ...formData, symptom_name: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="Teks Pertanyaan Kuesioner (Bentuk Tanya)"
            value={formData.question_text}
            onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
            fullWidth
            multiline
            rows={3}
            size="small"
            placeholder="Apakah laptop Anda sering mengalami blank screen?"
          />
        </DialogContent>
        <DialogActions className="p-4 pt-2">
          <Button onClick={handleClose} disabled={saving} className="text-slate-500 normal-case font-medium">Batal</Button>
          <Button onClick={handleSave} disabled={saving} variant="contained" className="bg-linear-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white! normal-case rounded-xl shadow-md shadow-sky-500/20 px-6 font-medium transition-all disabled:opacity-70">
            {saving ? <CircularProgress size={24} color="inherit" /> : 'Simpan Data'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { className: 'rounded-2xl p-2' } }}
      >
        <DialogTitle className="font-bold text-slate-800 flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
            <DeleteIcon />
          </div>
          Konfirmasi Hapus
        </DialogTitle>
        <DialogContent className="text-slate-600 mt-2">
          Apakah Anda yakin ingin menghapus gejala <b>{symptomToDelete}</b>? Tindakan ini tidak dapat dibatalkan.
        </DialogContent>
        <DialogActions className="p-4 pt-2">
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={saving} className="text-slate-500 normal-case font-medium">Batal</Button>
          <Button onClick={executeDelete} disabled={saving} variant="contained" className="bg-rose-500 hover:bg-rose-600 text-white! normal-case rounded-xl shadow-md shadow-rose-500/20 px-6 font-medium transition-all disabled:opacity-70">
             {saving ? <CircularProgress size={24} color="inherit" /> : 'Ya, Hapus'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
