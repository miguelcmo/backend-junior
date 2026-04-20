const productos = [
        { id: 1, nombre: "Laptop", price: 1000 },
        { id: 2, nombre: "Mouse", price: 200 },
        { id: 3, nombre: "Printer", price: 500 }
    ]

export async function GET() {
    return Response.json(productos)
}

// nombre_var: var_type se llaman anotaciones de tipo o type annotations y es la forma de TS de definir el tipo de dato de la variable
export async function POST(req: Request) {
    const body = await req.json()

    const nuevo_producto = {
        id: productos.length + 1,
        nombre: body.nombre,
    }

    productos.push(nuevo_producto)

    return Response.json(nuevo_producto)
}