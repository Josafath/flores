'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const loveLetter = `
   Hoy ya no existe lo que estaba y sentía por esta persona. Te deseo lo mejor pero necesito avanzar

  return (
    <main className={styles.mainContainer}>
      <div className={styles.roseContainer}>
        {/* Vaso */}
        <div className={styles.glass}>
          <div className={styles.shine}></div>
        </div>
        
        {/* Espinas */}
        <div className={styles.thorns}>
          {[...Array(4)].map((_, i) => <div key={i}></div>)}
        </div>
        
        {/* Hojas */}
        <div className={styles.leaves}>
          {[...Array(4)].map((_, i) => <div key={i}></div>)}
        </div>
        
        {/* Pétalos */}
        <div className={styles.petals}>
          {[...Array(7)].map((_, i) => <div key={i}></div>)}
        </div>
        
        {/* Pétalos caídos */}
        <div className={styles.deadPetals}>
          {[...Array(4)].map((_, i) => <div key={i}></div>)}
        </div>
        
        <div className={styles.roseMessage}>Te quiero... más de lo que las palabras pueden decir</div>
        <button 
          onClick={() => setIsOpen(true)} 
          className={styles.letterButton}
        >
          Abrir carta
        </button>
      </div>

      {/* Modal de carta */}
      
      
      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setIsOpen(false)} 
              className={styles.closeButton}
            >
              &times;
            </button>
            <h2 className={styles.modalTitle}>Para ti 💌</h2>
            <div className={styles.letterContent}>
              {loveLetter.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className={styles.signature}>Con amor... Jossa</div>
             </div>
        </div>
      )}
    </main>
  );
}
