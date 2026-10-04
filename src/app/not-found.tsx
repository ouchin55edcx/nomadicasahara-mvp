// The root layout is a pass-through (see app/layout.tsx), so the fallback
// not-found page for unmatched, non-localized URLs has to render the document.
export default function RootNotFound() {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          color: "#111",
        }}
      >
        <main style={{textAlign: "center", padding: "24px"}}>
          <h1 style={{fontSize: "20px", margin: 0}}>404</h1>
          <p style={{margin: "8px 0 16px"}}>Página no encontrada</p>
          <a href="/es" style={{color: "#0f766e"}}>
            Nomadica Sahara
          </a>
        </main>
      </body>
    </html>
  );
}
