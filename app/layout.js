// app/layout.js
// Globalny układ aplikacji z boczną nawigacją, górnym paskiem i stopką

import "./globals.css";
import { Roboto } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Moja aplikacja",
  description: "Układ globalny aplikacji",
};

import { AuthProvider } from "@/app/_lib/authcontext";
import Header from "./Header";
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className={roboto.className} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AuthProvider>
          <Header />

          {/* Główna część */}
          <main style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            {/* Zawartość dynamiczna stron */}
            <div style={{ padding: "20px", flexGrow: 1 }}>
              {children}
            </div>

            {/* Stopka */}
            <footer
              style={{
                background: "#1f1f1f",
                color: "white",
                textAlign: "center",
                padding: "10px 0",
              }}
            >
              © {new Date().getFullYear()} Moja aplikacja — Wszystkie prawa zastrzeżone. Autorka: Natalia Bała
            </footer>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "8px 0",
  display: "block",
  borderBottom: "1px solid #333",
};
