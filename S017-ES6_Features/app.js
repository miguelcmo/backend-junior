const productos = [
  { nombre: "Laptop", precio: 3000, disponible: true },
  { nombre: "Mouse", precio: 80, disponible: false },
  { nombre: "Teclado", precio: 150, disponible: true }
];

// 1. Obtener solo productos disponibles
const disponibles = productos
    .filter(p => p.disponible)
    .map(p => p.nombre);

// 2. Obtener nombres de productos
const nombres = productos.map(p => p.nombre);

// 3. Calcular total de precios
const total = productos.reduce((acc, p) => acc + p.precio, 0);

console.log(disponibles, nombres, total);