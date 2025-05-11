'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const loveLetter = `
    Querida Dreita:
  Hoy quiero regalarte algo que vaya más allá de un simple "te quiero", es algo que refleje un poco lo que siento por ti. No siempre tengo dinero para comprarte flores, pero como sabes, soy un programador y siendo un "nerd" de corazón, se me ocurrió que podía sorprenderte con algo único: una página con una rosa hecha por mí.
    
  Sé que aún estoy en el proceso de mejorar y crecer, pero quería hacerte sentir especial, como te mereces. A través de esto, intento demostrarte que aunque soy un trabajo en progreso, estoy buscando formas de hacerte sonreír y mostrarte mi cariño. Cada vez que hablamos, siento que doy un paso hacia ser una mejor versión de mí mismo, porque quiero ser alguien digno de ti.
    
  Creo en ti profundamente. No solo porque me gustas, sino porque veo en ti a una persona increíblemente talentosa, fuerte y con un brillo especial que no cualquiera tiene. Estás destinada a lograr cosas grandes, a dejar huella, a inspirar a otros con lo que haces y cómo lo haces. No tengo duda de que vas a llegar lejos, porque tienes todo para hacerlo: pasión, disciplina, sensibilidad y una luz única. A mí me hace feliz saber que puedo acompañarte, aunque sea un poquito, en ese camino tan hermoso que estás construyendo. Gracias por ser tú, por enseñarme tanto sin darte cuenta, y por hacer que este nerd quiera usar lo que sabe para hacerte sentir querida.
    
    Te quiero muchísimo y siempre estaré aquí para ti. 
  `;

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
