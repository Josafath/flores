import { Dancing_Script, Lora } from "next/font/google";
import "./globals.css";

// Letra manuscrita para títulos y firma
const script = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
});

// Letra con serifas para el cuerpo de la carta
const serif = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata = {
  title: "Regalito",
  description: "Una pequeña sorpresa para Fátima",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${script.variable} ${serif.variable}`}>
        {children}
      </body>
    </html>
  );
}
