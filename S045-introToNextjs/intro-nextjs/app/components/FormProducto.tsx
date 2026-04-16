"use client";

import { useState } from "react";

export default function FormProducto() {
  const [nombre, setNombre] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/productos", {
      method: "POST",
      body: JSON.stringify({ nombre }),
    });

    setNombre("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Producto"
      />
      <button>Guardar</button>
    </form>
  );
}