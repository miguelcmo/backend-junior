export const productos = [
    { id: 1, nombre: "tablet", precio: 1000000 },
    { id: 2, nombre: "scooter", precio: 2500000 },
    { id: 3, nombre: "audifonos", precio: 150000 },
    { id: 4, nombre: "monitor", precio: 900000 }
];

export function obtenerProductoPorId(id) {
    return productos.find(producto => producto.id === id);
}