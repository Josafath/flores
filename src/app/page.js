'use client';
import { useEffect, useState } from 'react';
import Rose from './Rose';
import Rose3D from './Rose3D';
import styles from './page.module.css';

// Cada elemento es un párrafo de la carta; el primero es el saludo
const loveLetter = [
  'Fátima:',
  'Te he regalado muchas flores, y me encanta ver tu cara cada vez que llego con un ramo. Pero esta vez quise darte una diferente: una que hice yo mismo, con lo que mejor sé hacer, código. No huele a nada y no cabe en un florero, pero tiene algo que las otras no: nunca se va a marchitar.',
  'Desde que supimos que vamos a ser papás, todo se siente distinto. Me emociona de una forma que no sé explicar bien. Cada día te veo y pienso en lo fuerte que eres, en todo lo que estás cargando (literalmente) y en lo bonito que va a ser conocer a nuestro bebé.',
  'Gracias por elegirme para esta aventura. Te prometo estar ahí en los antojos raros, en los miedos y en las risas. Quiero que nuestro bebé crezca viendo lo mucho que quiero a su mamá.',
  'Sé que mis actitudes no siempre son las mejores. A veces me equivoco, me desespero o no digo las cosas de la mejor manera. Pero aun en esos días te amo, y quiero seguir aprendiendo a ser mejor para ti. Quiero que pasemos juntos por todo: lo bonito, lo difícil y todo lo que venga.',
  'La rosa eres tú, y el botoncito que está a su lado es nuestro bebé, que todavía está por florecer. Es mi manera de decirte que te quiero, que te admiro y que estoy feliz de formar una familia contigo.',
  'Te amo.',
];

// Posiciones fijas (no aleatorias) para que el servidor y el navegador coincidan
const stars = Array.from({ length: 45 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: `${1 + (i % 3)}px`,
  animationDelay: `${(i % 9) * 0.5}s`,
}));

const sparkles = Array.from({ length: 6 }, (_, i) => ({
  left: `${40 + ((i * 23) % 120)}px`,
  animationDelay: `${5 + i * 1.3}s`,
}));

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  // Cerrar la carta con Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <main className={styles.mainContainer}>
      {/* Cielo estrellado */}
      <div className={styles.stars} aria-hidden="true">
        {stars.map((style, i) => (
          <span key={i} style={{ ...style, width: style.size, height: style.size }}></span>
        ))}
      </div>

      <div className={styles.stage}>
        {/* Rosa en 3D; si no hay WebGL se usa la versión en SVG */}
        <Rose3D
          fallback={
            <div className={styles.roseContainer}>
              {/* Vaso */}
              <div className={styles.glass}>
                <div className={styles.shine}></div>
              </div>

              <Rose />

              {/* Pétalos que caen */}
              <div className={styles.deadPetals} aria-hidden="true">
                {[...Array(4)].map((_, i) => <div key={i}></div>)}
              </div>

              {/* Destellos que suben dentro del vaso */}
              <div className={styles.sparkles} aria-hidden="true">
                {sparkles.map((style, i) => <span key={i} style={style}></span>)}
              </div>
            </div>
          }
        />

        <div className={styles.roseMessage}>Esta nunca se va a marchitar</div>
        <button
          onClick={() => setIsOpen(true)}
          className={styles.letterButton}
        >
          Abrir carta 💌
        </button>
      </div>

      {/* Modal de carta */}
      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div
            className={styles.letter}
            role="dialog"
            aria-modal="true"
            aria-labelledby="letter-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
              aria-label="Cerrar carta"
            >
              &times;
            </button>

            <div className={styles.seal} aria-hidden="true">♥</div>
            <h2 id="letter-title" className={styles.letterTitle}>Para ti, mi amor</h2>
            <div className={styles.divider} aria-hidden="true">❦</div>

            <div className={styles.letterBody}>
              {loveLetter.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className={styles.signature}>
              <span>Con amor,</span>
              <strong>Jossa</strong>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
