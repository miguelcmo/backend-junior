import Counter from "./components/Counter";

export default function Home() {
  console.log("Renderizando en...");

  return (
    <main>
      <h1>Bienvenidos a Next.js 🚀</h1>
      <Counter />
    </main>
  );
}