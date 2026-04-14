import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header style={{ padding: "10px", background: "#eee" }}>
          <h2>Mi App Next.js</h2>
        </header>

        <nav>
          <Link href="/">Home</Link> |{" "}
          <Link href="/productos">Productos</Link>
        </nav>

        {children}

        <footer style={{ padding: "10px", background: "#eee" }}>
          <p>Footer</p>
        </footer>
      </body>
    </html>
  );
}