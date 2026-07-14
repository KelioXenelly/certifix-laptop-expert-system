import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Menandai route ini agar selalu dinamis (tidak di-cache secara statis oleh Next.js)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Inisialisasi Supabase client (kita gunakan versi standar karena ini adalah route API)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Lakukan query super ringan (limit 1) hanya untuk "membangunkan" database
    const { data, error } = await supabase.from('damage').select('damage_id').limit(1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Supabase successfully pinged! Server is kept alive.',
      timestamp: new Date().toISOString(),
      data
    });
  } catch (error: any) {
    console.error('Keep-alive cron error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
