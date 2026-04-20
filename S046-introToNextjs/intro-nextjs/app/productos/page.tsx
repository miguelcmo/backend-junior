import Link from "next/link"
import ProductForm from "../components/ProductForm"

// const productos = [
//     { id: 1, nombre: "Laptop" },
//     { id: 2, nombre: "Mouse" }
// ]

// async function getProducts () {
//     const res =await fetch("https://fakestoreapi.com/products", {
//         cache: "no-store",
//         next: { revalidate: 10 },
//     })

//     return res.json()
// }

async function getProducts () {
    const res = await fetch("http://localhost:3000/api/productos")

    return res.json()
}

export default async function Productos () {
    const productos = await getProducts()

    return (
        <div>
            <h1>Lista de productos.</h1>

            <h2>Nuevo producto</h2>
            <ProductForm />

            <ul>
                {productos.map((p) => (
                    <li key={p.id}>
                        <Link href={`/productos/${p.id}`}>
                        {p.nombre}
                        </Link>
                        <p>{p.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}