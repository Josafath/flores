import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
});

const geistMono = Geist_Mono({

});

export const metadata = {
  title: "Regalito",
  description: "Una pequeña sorpresa para la princess",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
