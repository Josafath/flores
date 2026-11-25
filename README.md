# Una rosa para ti 🌹

Una página hecha a mano como regalo: una rosa animada dentro de un vaso de cristal, con un botón cerrado a su lado que representa a nuestro bebé, y una carta que se abre al final.

## Qué tiene

- Rosa dibujada en SVG: el tallo se dibuja, las hojas crecen y la flor abre por capas.
- Pétalos que caen, destellos y un cielo estrellado.
- Carta con estilo de papel, sello de cera y letra manuscrita.
- Funciona en celular y respeta la opción de "reducir movimiento" del sistema.

Hecho con [Next.js](https://nextjs.org) y CSS puro, sin librerías extra.

## Correrlo en tu computadora

Necesitas Node.js 20 o más nuevo.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Dónde cambiar las cosas

| Qué | Archivo |
| --- | --- |
| Texto de la carta, mensaje y firma | `src/app/page.js` |
| Dibujo de la rosa y el botón | `src/app/Rose.js` |
| Animaciones de la rosa | `src/app/Rose.module.css` |
| Estilos de la página y la carta | `src/app/page.module.css` |
| Título de la pestaña y vista previa del link | `src/app/layout.js` |

## Deploy en Vercel

1. Sube el repo a GitHub.
2. En [vercel.com/new](https://vercel.com/new) importa el repo. Vercel detecta Next.js solo; no hay que cambiar nada.
3. El nombre del proyecto será el link (`nombre.vercel.app`).

La página no se indexa en buscadores: solo la ve quien tenga el link.
