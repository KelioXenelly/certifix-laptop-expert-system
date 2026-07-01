'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Rule, Damage, Symptom } from '@/types';
import { buildRulePaths, RulePath } from '@/lib/expertSystem/forwardChaining';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Skeleton, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { toast } from 'sonner';

export default function RuleManagement() {
  const supabase = createClient();
  const [rules, setRules] = useState<RulePath[]>([]);
  const [damages, setDamages] = useState<Damage[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog State
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<{
    rule_code: string;
    damage_id: string;
    steps: { symptom_id: string; expert_cf: number }[];
  }>({ 
    rule_code: '', 
    damage_id: '', 
    steps: [{ symptom_id: '', expert_cf: 0.8 }] 
  });

  // Delete Confirmation State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Search & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof RulePath; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    const [rulesRes, damagesRes, symptomsRes] = await Promise.all([
      supabase.from('rule').select('*').order('step_order'),
      supabase.from('damage').select('*'),
      supabase.from('symptom').select('*')
    ]);

    if (rulesRes.data) {
      setRules(buildRulePaths(rulesRes.data as Rule[]));
    }
    if (damagesRes.data) setDamages(damagesRes.data as Damage[]);
    if (symptomsRes.data) setSymptoms(symptomsRes.data as Symptom[]);
    setLoading(false);
  };

  const filteredRules = useMemo(() => {
    let result = rules;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(r => 
        r.rule_code.toLowerCase().includes(lower) || 
        r.damage_id.toLowerCase().includes(lower) ||
        r.steps.some(s => s.symptom_id.toLowerCase().includes(lower))
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
  }, [rules, searchTerm, sortConfig]);

  const requestSort = (key: keyof RulePath) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getNextRuleCode = (existingRules: RulePath[]) => {
    const existingNumbers = existingRules
      .map(r => parseInt(r.rule_code.replace('R', '')))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);
    
    let nextNum = 1;
    for (const num of existingNumbers) {
      if (num === nextNum) {
        nextNum++;
      } else if (num > nextNum) {
        break;
      }
    }
    return `R${nextNum}`;
  };

  const handleOpen = (rulePath?: RulePath) => {
    if (rulePath) {
      setIsEditing(true);
      setFormData({
        rule_code: rulePath.rule_code,
        damage_id: rulePath.damage_id,
        steps: rulePath.steps.map(s => ({ symptom_id: s.symptom_id, expert_cf: s.expert_cf }))
      });
    } else {
      setIsEditing(false);
      setFormData({ rule_code: getNextRuleCode(rules), damage_id: '', steps: [{ symptom_id: '', expert_cf: 0.8 }] });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (!formData.rule_code || !formData.damage_id || formData.steps.length === 0) {
      toast.error('Harap isi Rule Code dan Target Kerusakan.');
      return;
    }

    const cleanSteps = formData.steps.filter(s => s.symptom_id.trim() !== '');
    if (cleanSteps.length === 0) {
      toast.error('Minimal harus ada 1 Gejala (Symptom).');
      return;
    }

    const rowsToInsert = cleanSteps.map((step, index) => ({
      rule_code: formData.rule_code,
      damage_id: formData.damage_id,
      symptom_id: step.symptom_id.trim(),
      expert_cf: step.expert_cf,
      step_order: index + 1
    }));

    if (isEditing) {
      await supabase.from('rule').delete().eq('rule_code', formData.rule_code);
    } 
    
    setSaving(true);
    const { error } = await supabase.from('rule').insert(rowsToInsert);
    setSaving(false);
    
    if (error) {
      toast.error(`Gagal menyimpan Rule: ${error.message}`);
      console.error(error);
    } else {
      toast.success(isEditing ? 'Berhasil mengubah Rule!' : 'Berhasil menambah Rule baru!');
      fetchRules();
      handleClose();
    }
  };

  const confirmDelete = (rule_code: string) => {
    setRuleToDelete(rule_code);
    setDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!ruleToDelete) return;
    setSaving(true);
    const { error } = await supabase.from('rule').delete().eq('rule_code', ruleToDelete);
    setSaving(false);

    if (error) {
      toast.error(`Gagal menghapus Rule: ${error.message}`);
    } else {
      toast.success('Berhasil menghapus Rule!');
      fetchRules();
      setDeleteDialogOpen(false);
      setRuleToDelete(null);
    }
  };

  const addStep = () => {
    setFormData(prev => ({ ...prev, steps: [...prev.steps, { symptom_id: '', expert_cf: 0.8 }] }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({ ...prev, steps: prev.steps.filter((_, i) => i !== index) }));
  };

  const updateStep = (index: number, field: 'symptom_id' | 'expert_cf', value: any) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps[index] = { ...newSteps[index], [field]: value };
      return { ...prev, steps: newSteps };
    });
  };

  return (
    <div className="animate-fade-in relative z-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-heading tracking-tight">Basis Pengetahuan (Rules)</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola relasi Kerusakan dan Gejala pada Decision Tree.</p>
        </div>
        <div className="flex gap-3">
          <TextField
            placeholder="Cari rule..."
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
            Tambah Rule
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <th 
                className="px-6 py-4 font-semibold uppercase tracking-wider text-xs w-32 cursor-pointer hover:bg-slate-100 select-none transition-colors"
                onClick={() => requestSort('rule_code')}
              >
                Rule Code {sortConfig?.key === 'rule_code' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th 
                className="px-6 py-4 font-semibold uppercase tracking-wider text-xs w-32 cursor-pointer hover:bg-slate-100 select-none transition-colors"
                onClick={() => requestSort('damage_id')}
              >
                ID Kerusakan {sortConfig?.key === 'damage_id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Alur Gejala (Kondisi & CF)</th>
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
            ) : filteredRules.map((row) => (
              <tr key={row.rule_code} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{row.rule_code}</td>
                <td className="px-6 py-4 font-bold text-sky-600">{row.damage_id}</td>
                <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {row.steps.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                          <span className="font-bold text-slate-700">{s.symptom_id}</span>
                          <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-1.5 rounded">CF: {s.expert_cf}</span>
                        </span>
                        {i < row.steps.length - 1 && <span className="text-slate-400 font-bold">→</span>}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 flex justify-center gap-1">
                  <IconButton size="small" onClick={() => handleOpen(row)} className="text-sky-600 hover:bg-sky-50">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => confirmDelete(row.rule_code)} className="text-rose-600 hover:bg-rose-50">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </td>
              </tr>
            ))}
            {filteredRules.length === 0 && !loading && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">Belum ada aturan (rule) atau pencarian tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth slotProps={{ paper: { className: 'rounded-2xl' } }}>
        <DialogTitle className="font-bold text-slate-800 border-b border-slate-100 pb-4">
          {isEditing ? 'Ubah Rule' : 'Tambah Rule Baru'}
        </DialogTitle>
        <DialogContent className="flex flex-col gap-5 pt-6!">
          <div className="flex gap-4">
            <TextField
              label="Rule Code (Contoh: R1)"
              value={formData.rule_code}
              onChange={(e) => setFormData({ ...formData, rule_code: e.target.value })}
              fullWidth
              size="small"
              disabled={true}
            />
            <FormControl fullWidth size="small">
              <InputLabel id="damage-select-label">Target Kerusakan</InputLabel>
              <Select
                labelId="damage-select-label"
                value={formData.damage_id}
                label="Target Kerusakan"
                onChange={(e) => setFormData({ ...formData, damage_id: e.target.value as string })}
              >
                {damages.map(d => (
                  <MenuItem key={d.damage_id} value={d.damage_id}>
                    <span className="font-bold w-12 inline-block text-slate-600">{d.damage_id}</span> {d.damage_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col gap-3 mt-2 border-t border-slate-100 pt-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-slate-700">Daftar Kondisi (Gejala)</label>
              <Button size="small" startIcon={<AddIcon />} onClick={addStep} className="normal-case text-sky-600">
                Tambah Gejala
              </Button>
            </div>
            
            {formData.steps.map((step, index) => (
              <div key={index} className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="mt-2 text-xs font-bold text-slate-400 w-5 text-center shrink-0">{index + 1}.</div>
                
                <FormControl fullWidth size="small" className="bg-white">
                  <InputLabel id={`symptom-select-label-${index}`}>Gejala</InputLabel>
                  <Select
                    labelId={`symptom-select-label-${index}`}
                    value={step.symptom_id}
                    label="Gejala"
                    onChange={(e) => updateStep(index, 'symptom_id', e.target.value as string)}
                  >
                    {symptoms.map(s => (
                      <MenuItem key={s.symptom_id} value={s.symptom_id}>
                        <span className="font-bold w-12 inline-block text-slate-600">{s.symptom_id}</span> {s.symptom_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" className="w-36 bg-white shrink-0">
                  <InputLabel id={`cf-select-label-${index}`}>Bobot CF</InputLabel>
                  <Select
                    labelId={`cf-select-label-${index}`}
                    value={step.expert_cf}
                    label="Bobot CF"
                    onChange={(e) => updateStep(index, 'expert_cf', Number(e.target.value))}
                  >
                    <MenuItem value={0.2}>0.2 - Sangat Rendah</MenuItem>
                    <MenuItem value={0.4}>0.4 - Rendah</MenuItem>
                    <MenuItem value={0.6}>0.6 - Sedang</MenuItem>
                    <MenuItem value={0.8}>0.8 - Tinggi</MenuItem>
                    <MenuItem value={1.0}>1.0 - Pasti</MenuItem>
                  </Select>
                </FormControl>

                <IconButton 
                  size="small" 
                  onClick={() => removeStep(index)} 
                  disabled={formData.steps.length === 1}
                  className="mt-0.5 text-rose-500 disabled:text-slate-300"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
          </div>
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
          Apakah Anda yakin ingin menghapus seluruh alur <b>Rule {ruleToDelete}</b>? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua kondisi gejala di dalamnya.
        </DialogContent>
        <DialogActions className="p-4 pt-2">
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={saving} className="text-slate-500 normal-case font-medium">Batal</Button>
          <Button onClick={executeDelete} disabled={saving} variant="contained" className="bg-rose-500 hover:bg-rose-600 text-white! normal-case rounded-xl shadow-md shadow-rose-500/20 px-6 font-medium transition-all disabled:opacity-70">
            {saving ? <CircularProgress size={24} color="inherit" /> : 'Ya, Hapus Rule'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
