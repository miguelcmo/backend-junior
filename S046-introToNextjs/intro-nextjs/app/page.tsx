"use client"

import Counter from "./components/Counter"

export default function Home() {
  console.log("Renderizando la app en: ")

  return (
    <>
      <h1>Aplicación de Nextjs - Home</h1>
      <Counter />
    </>
  );
}
