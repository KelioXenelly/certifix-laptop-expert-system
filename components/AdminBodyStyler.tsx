'use client';

import { useEffect } from 'react';

export default function AdminBodyStyler() {
  useEffect(() => {
    document.documentElement.classList.remove('bg-slate-900');
    document.documentElement.classList.add('bg-slate-50');
    
    document.body.classList.remove('bg-slate-900', 'text-slate-100');
    document.body.classList.add('bg-slate-50', 'text-slate-800');
    
    return () => {
      document.documentElement.classList.remove('bg-slate-50');
      document.documentElement.classList.add('bg-slate-900');
      
      document.body.classList.remove('bg-slate-50', 'text-slate-800');
      document.body.classList.add('bg-slate-900', 'text-slate-100');
    };
  }, []);

  return null;
}
