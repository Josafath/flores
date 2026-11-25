import styles from './Rose.module.css';

// Rosa dibujada en SVG: tallo, hojas, la flor y un botón cerrado (el bebé).
// El lienzo mide lo mismo que el vaso (200x350) para que encaje encima.
export default function Rose() {
  return (
    <svg className={styles.rose} viewBox="0 0 200 350" aria-hidden="true">
      <defs>
        <radialGradient id="rg-back" cx="50%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#c22a52" />
          <stop offset="100%" stopColor="#4f0a1c" />
        </radialGradient>
        <linearGradient id="rg-cup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0466e" />
          <stop offset="55%" stopColor="#b81b43" />
          <stop offset="100%" stopColor="#5c0b21" />
        </linearGradient>
        <radialGradient id="rg-inner" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#2e0511" />
          <stop offset="100%" stopColor="#7a102c" />
        </radialGradient>
        <linearGradient id="rg-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ec5c82" />
          <stop offset="100%" stopColor="#9e183a" />
        </linearGradient>
        <radialGradient id="rg-bud" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#f7a1b7" />
          <stop offset="60%" stopColor="#d52d58" />
          <stop offset="100%" stopColor="#9e183a" />
        </radialGradient>
        <linearGradient id="rg-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f06a8c" />
          <stop offset="50%" stopColor="#c9204b" />
          <stop offset="100%" stopColor="#6e0d26" />
        </linearGradient>
        {/* Borde enrollado de los pétalos, más claro porque le pega la luz */}
        <linearGradient id="rg-lip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb3c6" />
          <stop offset="100%" stopColor="#e0466e" />
        </linearGradient>
        <linearGradient id="rg-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4caf50" />
          <stop offset="100%" stopColor="#0b5d0b" />
        </linearGradient>
        {/* Sombra suave entre capas de pétalos */}
        <filter id="rg-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#2e0511" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Tallos: se dibujan de abajo hacia arriba */}
      <path className={`${styles.stem} ${styles.budStem}`} d="M101 342 C 108 300, 140 262, 140 214" />
      <path className={styles.stem} d="M100 342 C 104 260, 96 190, 100 122" />

      {/* Espinas */}
      <g className={styles.thorns}>
        <path d="M99 175 L90 170 L99 181 Z" />
        <path d="M101 205 L110 200 L101 211 Z" />
        <path d="M99 285 L90 280 L99 291 Z" />
        <path d="M121 268 L127 262 L119 272 Z" />
      </g>

      {/* Hojas con nervadura */}
      <g className={`${styles.leaf} ${styles.leafLeft}`}>
        <path d="M99 238 C 85 214, 62 204, 48 202 C 56 224, 76 242, 99 238 Z" />
        <path className={styles.vein} d="M99 238 Q 74 220 50 203" />
      </g>
      <g className={`${styles.leaf} ${styles.leafSmall}`}>
        <path d="M99 300 C 88 284, 72 280, 62 280 C 68 296, 82 304, 99 300 Z" />
        <path className={styles.vein} d="M99 300 Q 80 290 64 281" />
      </g>
      <g className={`${styles.leaf} ${styles.leafRight}`}>
        <path d="M128 252 C 140 238, 158 236, 170 238 C 160 252, 144 258, 128 252 Z" />
        <path className={styles.vein} d="M128 252 Q 150 244 168 238" />
      </g>

      {/* Botón cerrado: el bebé que todavía está por florecer */}
      <g transform="translate(140 214) scale(1.25)">
        <g className={styles.bud}>
          <path fill="url(#rg-bud)" d="M0 0 C -10 -6, -9 -24, 0 -31 C 9 -24, 10 -6, 0 0 Z" />
          <path className={styles.spiral} d="M-3 -24 C 0 -27, 4 -24, 2 -19" />
          <path className={styles.sepal} d="M0 2 C -11 -1, -11 -13, -6 -20 C -5 -11, -2 -5, 0 2 Z" />
          <path className={styles.sepal} d="M0 2 C 11 -1, 11 -13, 6 -20 C 5 -11, 2 -5, 0 2 Z" />
        </g>
      </g>

      {/* Flor: coordenadas locales de 120x120, la base (60,100) queda sobre el tallo */}
      <g className={styles.head} transform="translate(31 10) scale(1.15)">
        <g className={styles.headInner}>
          {/* Pétalos de atrás, con la punta enrollada */}
          <g className={`${styles.petal} ${styles.p1}`}>
            <path fill="url(#rg-back)" d="M34 48 C 32 22, 48 8, 60 10 C 72 8, 88 22, 86 48 C 76 56, 44 56, 34 48 Z" />
            <path fill="url(#rg-lip)" opacity="0.7" d="M34 48 C 32 22, 48 8, 60 10 C 72 8, 88 22, 86 48 C 82 28, 70 16, 60 17 C 50 16, 38 28, 34 48 Z" />
          </g>
          <g className={`${styles.petal} ${styles.p2}`} filter="url(#rg-shadow)">
            <path fill="url(#rg-back)" d="M58 96 C 30 98, 6 74, 12 46 C 15 34, 28 28, 40 34 C 50 50, 56 72, 58 96 Z" />
            <path fill="url(#rg-lip)" opacity="0.75" d="M12 46 C 15 34, 28 28, 40 34 C 30 32, 20 36, 14 50 Z" />
          </g>
          <g className={`${styles.petal} ${styles.p3}`} filter="url(#rg-shadow)">
            <path fill="url(#rg-back)" d="M62 96 C 90 98, 114 74, 108 46 C 105 34, 92 28, 80 34 C 70 50, 64 72, 62 96 Z" />
            <path fill="url(#rg-lip)" opacity="0.75" d="M108 46 C 105 34, 92 28, 80 34 C 90 32, 100 36, 106 50 Z" />
          </g>

          {/* Copa, abertura y pétalos internos en espiral */}
          <g className={`${styles.petal} ${styles.p4}`} filter="url(#rg-shadow)">
            <path fill="url(#rg-cup)" d="M26 50 C 24 80, 42 99, 60 99 C 78 99, 96 80, 94 50 C 82 60, 38 60, 26 50 Z" />
            <path fill="url(#rg-inner)" d="M30 50 C 36 34, 84 34, 90 50 C 78 58, 42 58, 30 50 Z" />
          </g>
          <g className={`${styles.petal} ${styles.p5}`}>
            <path fill="url(#rg-mid)" d="M34 50 C 38 38, 62 33, 71 42 C 58 42, 46 46, 44 56 C 38 55, 35 53, 34 50 Z" />
            <path fill="url(#rg-mid)" d="M86 50 C 82 38, 58 33, 49 42 C 62 42, 74 46, 76 56 C 82 55, 85 53, 86 50 Z" />
            <path fill="url(#rg-bud)" filter="url(#rg-shadow)" d="M48 50 C 48 39, 72 39, 72 50 C 66 57, 54 57, 48 50 Z" />
            <path className={styles.spiral} d="M60 49 C 54 49, 53 44, 57 42 C 63 40, 68 44, 66 49 C 63 53, 53 53, 51 47" />
          </g>
          {/* Borde frontal de la copa enrollado hacia afuera */}
          <path className={`${styles.petal} ${styles.p5}`} fill="url(#rg-lip)" opacity="0.85"
            d="M26 50 C 38 60, 82 60, 94 50 C 82 65, 38 65, 26 50 Z" />

          {/* Pétalos de enfrente que abrazan la copa */}
          <g className={`${styles.petal} ${styles.p6}`} filter="url(#rg-shadow)">
            <path fill="url(#rg-front)" d="M60 100 C 38 101, 20 84, 22 58 C 34 64, 50 76, 60 100 Z" />
            <path fill="url(#rg-lip)" opacity="0.6" d="M22 58 C 34 64, 50 76, 60 100 C 46 82, 34 70, 23 62 Z" />
          </g>
          <g className={`${styles.petal} ${styles.p7}`} filter="url(#rg-shadow)">
            <path fill="url(#rg-front)" d="M60 100 C 82 101, 100 84, 98 58 C 86 64, 70 76, 60 100 Z" />
            <path fill="url(#rg-lip)" opacity="0.6" d="M98 58 C 86 64, 70 76, 60 100 C 74 82, 86 70, 97 62 Z" />
          </g>
          <g className={`${styles.petal} ${styles.p8}`} filter="url(#rg-shadow)">
            <path fill="url(#rg-front)" d="M40 76 C 46 68, 74 68, 80 76 C 80 92, 70 101, 60 101 C 50 101, 40 92, 40 76 Z" />
            <path fill="url(#rg-lip)" opacity="0.8" d="M40 76 C 46 68, 74 68, 80 76 C 72 73, 48 73, 40 76 Z" />
          </g>

          {/* Sépalos */}
          <path className={styles.sepal} d="M60 99 C 52 100, 44 104, 38 112 C 48 110, 55 106, 60 102 Z" />
          <path className={styles.sepal} d="M60 99 C 68 100, 76 104, 82 112 C 72 110, 65 106, 60 102 Z" />
        </g>
      </g>
    </svg>
  );
}
