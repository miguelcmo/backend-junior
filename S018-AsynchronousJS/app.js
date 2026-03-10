async function obtenerProducto(id) {
    try {
        const respuesta = await fetch(`https://dummyjson.com/products/${id}`)
        const producto = await respuesta.json()
        return producto
    } catch (error) {
        throw new Error("Error al obtener el producto desde la API")
    }
}

async function procesarPedido(productoId) {
    try {
        const producto = await obtenerProducto(productoId)
        console.log(producto)
    } catch (error) {
        console.log(error)
    }
}

procesarPedido(1)