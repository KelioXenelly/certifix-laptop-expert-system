import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'CertiFix | Sistem Pakar Diagnosa Laptop';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a', // slate-900
          backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e1b4b, #0c4a6e)',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          background: 'rgba(30, 41, 59, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #0ea5e9, #4f46e5)',
            width: '120px',
            height: '120px',
            borderRadius: '30px',
            marginBottom: '40px',
            boxShadow: '0 10px 20px rgba(14, 165, 233, 0.3)',
          }}>
            <span style={{ fontSize: '70px', color: 'white', fontWeight: 'bold', fontFamily: 'sans-serif' }}>C</span>
          </div>
          <h1 style={{ fontSize: '80px', fontWeight: 900, color: 'white', margin: '0 0 20px 0', letterSpacing: '-2px' }}>
            CertiFix
          </h1>
          <p style={{ fontSize: '32px', color: '#94a3b8', margin: '0 0 30px 0', textAlign: 'center', maxWidth: '800px', lineHeight: 1.4 }}>
            Sistem Pakar Diagnosa Kerusakan Laptop
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', padding: '10px 20px', borderRadius: '20px', fontSize: '20px', fontWeight: 'bold' }}>Decision Tree</span>
            <span style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', padding: '10px 20px', borderRadius: '20px', fontSize: '20px', fontWeight: 'bold' }}>Certainty Factor</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
