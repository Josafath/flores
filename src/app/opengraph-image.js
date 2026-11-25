import { ImageResponse } from 'next/og';

// Imagen que aparece al compartir el link; se genera una vez al compilar
export const alt = 'Una rosa para ti';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 40%, #13263b 0%, #0a1622 70%)',
          color: '#ffebee',
        }}
      >
        <svg width="220" height="260" viewBox="0 0 64 76">
          <path d="M32 74 C 33 60, 31 48, 32 36" stroke="#2e8b35" strokeWidth="2.5" fill="none" />
          <path d="M32 56 C 26 50, 18 50, 14 51 C 18 57, 25 59, 32 56 Z" fill="#2e8b35" />
          <path d="M14 18 C 12 30, 20 38, 32 38 C 44 38, 52 30, 50 18 C 44 24, 20 24, 14 18 Z" fill="#c9204b" />
          <path d="M18 18 C 22 8, 42 8, 46 18 C 40 23, 24 23, 18 18 Z" fill="#5c0b21" />
          <path d="M24 18 C 24 11, 40 11, 40 18 C 36 22, 28 22, 24 18 Z" fill="#e0466e" />
        </svg>
        <div style={{ fontSize: 72, marginTop: 30 }}>Una rosa para ti</div>
      </div>
    ),
    size,
  );
}
