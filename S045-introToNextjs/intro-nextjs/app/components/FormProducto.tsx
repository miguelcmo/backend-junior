"use client";

import { useState } from "react";

// export default function FormProducto() {
//   const [nombre, setNombre] = useState("");

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     await fetch("/api/productos", {
//       method: "POST",
//       body: JSON.stringify({ nombre }),
//     });

//     setNombre("");
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         value={nombre}
//         onChange={(e) => setNombre(e.target.value)}
//         placeholder="Producto"
//       />
//       <button>Guardar</button>
//     </form>
//   );
// }

export default function FormProducto() {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) return;

    setLoading(true);

    await fetch("/api/productos", {
      method: "POST",
      body: JSON.stringify({ nombre }),
    });

    setNombre("");
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row gap-4"
    >
      {/* INPUT */}
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del producto"
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* BOTÓN */}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}