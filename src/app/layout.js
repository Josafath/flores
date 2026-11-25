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

const title = "Una rosa para ti 🌹";
const description = "Una pequeña sorpresa para Fátima";

export const metadata = {
  // Dominio del deploy en Vercel; con él se arma el link de la imagen de vista previa
  metadataBase: new URL("https://una-rosa-para-ti.vercel.app"),
  title,
  description,
  // Vista previa al compartir el link (WhatsApp, Messenger, etc.)
  openGraph: {
    title,
    description,
    locale: "es_MX",
    type: "website",
  },
  // Es un regalo personal: que no aparezca en buscadores
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport = {
  themeColor: "#0a1622",
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
