import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h1>404 — Strona nie została znaleziona</h1>
      <p>Wygląda na to, że taka ścieżka nie istnieje.</p>

      <Link
        href="/"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 20px",
          background: "#333",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none",
        }}
      >
        Wróć do strony głównej
      </Link>
    </div>
  );
}
