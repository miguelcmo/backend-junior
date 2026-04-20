"use client" 

import { useState } from "react"

export default function ProductForm () {
    const [nombre, setNombre] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        await fetch("api/productos", {
            method: "POST",
            body: JSON.stringify({ nombre }),
        })

        setNombre("")
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                value= {nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del producto"
            />
            <button>Guardar</button>
        </form>
    )
}