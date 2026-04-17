// async function getProductos() {
//   const res = await fetch("https://fakestoreapi.com/products", {
//     //cache: "no-store",
//     next: { revalidate: 10 },
//   });

//   return res.json();
// }

import FormProducto from "../components/FormProducto";
import Image from "next/image";

async function getProductos() {
    


  const res = await fetch("http://localhost:3000/api/productos", {
    next: { revalidate: 10 },
  });
  return res.json();

}



// export default async function Productos() {
//   const productos = await getProductos();

//   return (
//     <div>
//       <h1>Productos</h1>
// <FormProducto />
//       {productos.slice(0, 5).map((p: any) => (
//         <div key={p.id}>
//           <h3>{p.nombre}</h3>
//           <img src={p.image} alt={p.nombre} />
//           <p>${p.price}</p>
//         </div>
//       ))}
//     </div>
//   );
// }




export default async function Productos() {
  const productos = await getProductos();

  return (
    <div>
      {/* TÍTULO */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Productos
      </h1>

      {/* FORMULARIO */}
      <div className="mb-8">
        <FormProducto />
      </div>

      {/* GRID */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {productos.slice(0, 6).map((p: any) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* IMAGEN */}
            <div className="relative h-48 bg-gray-100">
              {/* <Image
                src={p.image}
                alt={p.title}
                fill
                className="object-contain p-4"
              /> */}
              <img src={p.image} alt="" />
            </div>

            {/* CONTENIDO */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {p.title}
              </h3>

              <p className="text-blue-600 font-bold text-xl">
                ${p.price}
              </p>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Ver detalle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}