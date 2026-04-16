// async function getProductos() {
//   const res = await fetch("https://fakestoreapi.com/products", {
//     //cache: "no-store",
//     next: { revalidate: 10 },
//   });

//   return res.json();
// }
"use client"
import FormProducto from "../components/FormProducto";
import { useRouter } from "next/navigation";


async function getProductos() {
    const router = useRouter();


  const res = await fetch("http://localhost:3000/api/productos", {
    next: { revalidate: 10 },
  });
  return res.json();

}
    router.refresh();


export default async function Productos() {
  const productos = await getProductos();

  return (
    <div>
      <h1>Productos</h1>
<FormProducto />
      {productos.slice(0, 5).map((p: any) => (
        <div key={p.id}>
          <h3>{p.nombre}</h3>
          <p>${p.price}</p>
        </div>
      ))}
    </div>
  );
}