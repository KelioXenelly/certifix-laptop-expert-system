'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Damage } from '@/types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Skeleton, CircularProgress } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { toast } from 'sonner';

export default function DamageManagement() {
  const supabase = createClient();
  const [damages, setDamages] = useState<Damage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog State
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Damage>>({ damage_id: '', damage_name: '', solution: '' });
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [damageToDelete, setDamageToDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Search & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Damage; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    fetchDamages();
  }, []);

  const fetchDamages = async () => {
    setLoading(true);
    const { data } = await supabase.from('damage').select('*').order('damage_id');
    if (data) setDamages(data as Damage[]);
    setLoading(false);
  };

  const filteredDamages = useMemo(() => {
    let result = damages;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(d => 
        d.damage_id.toLowerCase().includes(lower) || 
        d.damage_name.toLowerCase().includes(lower) || 
        d.solution.toLowerCase().includes(lower)
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
  }, [damages, searchTerm, sortConfig]);

  const requestSort = (key: keyof Damage) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getNextDamageCode = () => {
    if (damages.length === 0) return 'P001';
    
    const numbers = damages
      .map(d => parseInt(d.damage_id.replace('P', '')))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);
      
    if (numbers.length === 0) return 'P001';
    
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] !== i + 1) {
        return `P${String(i + 1).padStart(3, '0')}`;
      }
    }
    
    return `P${String(numbers.length + 1).padStart(3, '0')}`;
  };

  const handleOpen = (damage?: Damage) => {
    if (damage) {
      setIsEditing(true);
      setFormData(damage);
    } else {
      setIsEditing(false);
      setFormData({ damage_id: getNextDamageCode(), damage_name: '', solution: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ damage_id: '', damage_name: '', solution: '' });
  };

  const handleSave = async () => {
    if (!formData.damage_name?.trim()) {
      toast.error('Nama Kerusakan tidak boleh kosong!');
      return;
    }
    if (!formData.solution?.trim()) {
      toast.error('Solusi tidak boleh kosong!');
      return;
    }

    setSaving(true);
    let error;

    if (isEditing) {
      const res = await supabase.from('damage').update(formData).eq('damage_id', formData.damage_id);
      error = res.error;
    } else {
      const res = await supabase.from('damage').insert([formData]);
      error = res.error;
    }

    setSaving(false);

    if (error) {
      toast.error(`Gagal ${isEditing ? 'mengubah' : 'menambah'} data: ${error.message}`);
    } else {
      toast.success(`Berhasil ${isEditing ? 'mengubah' : 'menambah'} data kerusakan!`);
      fetchDamages();
      handleClose();
    }
  };

  const confirmDelete = (id: string) => {
    setDamageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!damageToDelete) return;
    setSaving(true);
    const { error } = await supabase.from('damage').delete().eq('damage_id', damageToDelete);
    setSaving(false);

    if (error) {
      toast.error(`Gagal menghapus data: ${error.message}`);
    } else {
      toast.success('Berhasil menghapus data kerusakan!');
      fetchDamages();
      setDeleteDialogOpen(false);
      setDamageToDelete(null);
    }
  };

  return (
    <div className="animate-fade-in relative z-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-heading tracking-tight">Master Data Kerusakan</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola daftar masalah/kerusakan beserta solusinya.</p>
        </div>
        <div className="flex gap-3">
          <TextField
            placeholder="Cari kerusakan..."
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
            Tambah Kerusakan
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-150">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <th 
                className="px-6 py-4 font-semibold uppercase tracking-wider text-xs w-32 cursor-pointer hover:bg-slate-100 select-none transition-colors"
                onClick={() => requestSort('damage_id')}
              >
                Kode (ID) {sortConfig?.key === 'damage_id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th 
                className="px-6 py-4 font-semibold uppercase tracking-wider text-xs w-1/3 cursor-pointer hover:bg-slate-100 select-none transition-colors"
                onClick={() => requestSort('damage_name')}
              >
                Nama Kerusakan {sortConfig?.key === 'damage_name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th 
                className="px-6 py-4 font-semibold uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 select-none transition-colors"
                onClick={() => requestSort('solution')}
              >
                Solusi / Penanganan {sortConfig?.key === 'solution' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
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
            ) : filteredDamages.map((row) => (
              <tr key={row.damage_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-sky-600">{row.damage_id}</td>
                <td className="px-6 py-4 text-slate-800 font-medium">{row.damage_name}</td>
                <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={row.solution}>{row.solution}</td>
                <td className="px-6 py-4 flex justify-center gap-1">
                  <IconButton size="small" onClick={() => handleOpen(row)} className="text-sky-600 hover:bg-sky-50">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => confirmDelete(row.damage_id)} className="text-rose-600 hover:bg-rose-50">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </td>
              </tr>
            ))}
            {filteredDamages.length === 0 && !loading && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">Belum ada data kerusakan atau pencarian tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth slotProps={{ paper: { className: 'rounded-2xl' } }}>
        <DialogTitle className="font-bold text-slate-800 border-b border-slate-100 pb-4">
          {isEditing ? 'Ubah Data Kerusakan' : 'Tambah Kerusakan Baru'}
        </DialogTitle>
        <DialogContent className="flex flex-col gap-5 pt-6!">
          <TextField
            label="Kode Kerusakan (Contoh: P001)"
            value={formData.damage_id}
            onChange={(e) => setFormData({ ...formData, damage_id: e.target.value })}
            disabled={true}
            fullWidth
            size="small"
            className="mt-2"
            helperText="Kode ID dibuat otomatis oleh sistem dan tidak dapat diubah."
          />
          <TextField
            label="Nama Kerusakan"
            value={formData.damage_name}
            onChange={(e) => setFormData({ ...formData, damage_name: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="Solusi / Penanganan"
            value={formData.solution}
            onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
            fullWidth
            multiline
            rows={4}
            size="small"
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
          Apakah Anda yakin ingin menghapus kerusakan <b>{damageToDelete}</b>? Tindakan ini tidak dapat dibatalkan.
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
