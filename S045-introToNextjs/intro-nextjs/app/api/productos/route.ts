// export async function GET() {
//   return Response.json([
//     { id: 1, title: "Laptop", price: 1000 },
//     { id: 2, title: "Mouse", price: 200 },
//     { id: 3, title: "Monitor", price: 500 },
//   ]);
// }

const productos = [
    { id: 1, nombre: "Laptop", price: 1000 },
    { id: 2, nombre: "Mouse", price: 200 },
    { id: 3, nombre: "Monitor", price: 500 },
];

export async function GET() {
  return Response.json(productos);
}

export async function POST(req: Request) {
  const body = await req.json();

  const nuevo = {
    id: productos.length + 1,
    nombre: body.nombre,
  };

  productos.push(nuevo);

  return Response.json(nuevo);
}