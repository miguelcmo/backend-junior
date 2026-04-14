import Link from "next/link";

const productos = [
  { id: 1, nombre: "Laptop" },
  { id: 2, nombre: "Mouse" },
];

export default function Productos() {
  return (
    <div>
      <h1>Productos</h1>

      <ul>
        {productos.map((p) => (
          <li key={p.id}>
            <Link href={`/productos/${p.id}`}>
              {p.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}