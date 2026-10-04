"use client";

// Replaces the root layout, so it must render <html>/<body> itself.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
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
          <h1 style={{fontSize: "20px", margin: 0}}>Something went wrong</h1>
          <p style={{margin: "8px 0 16px"}}>
            An unexpected error occurred. Please try again.
          </p>
          {error.digest ? (
            <p style={{fontSize: "12px", opacity: 0.6}}>Reference: {error.digest}</p>
          ) : null}
          <button type="button" onClick={reset} style={{cursor: "pointer"}}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
