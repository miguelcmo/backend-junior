import { obtenerProductoPorId } from "./products.js";

const carrito = (function () {

    let items = [];

    function agregarProducto(id) {
        const producto = obtenerProductoPorId(id);

        if (!producto) {
            console.log("Producto no encontrado");
            return;
        }

        items.push(producto);
        console.log(`${producto.nombre} agregado al carrito`);
    }

    function eliminarProducto(id) {
        const index = items.findIndex(item => item.id === id);

        if (index === -1) {
            console.log("Producto no está en el carrito");
            return;
        }

        const eliminado = items.splice(index, 1);
        console.log(`${eliminado[0].nombre} eliminado del carrito`);
    }

    function obtenerSubtotal() {
        return items.reduce((acum, item) => acum + item.precio, 0);
    }

    function listarProductos() {
        return [...items]; // evita modificación externa
    }

        return {
        agregarProducto,
        eliminarProducto,
        obtenerSubtotal,
        listarProductos
    };

})();

export default carrito;