import carrito from "./cart.js";
import calcularTotalConImpuesto from "./tax.js";

carrito.agregarProducto(1);
carrito.agregarProducto(2);
carrito.agregarProducto(3);

carrito.eliminarProducto(2);

console.log("\nProductos en carrito:");
console.log(carrito.listarProductos());

const subtotal = carrito.obtenerSubtotal();
console.log("\nSubtotal:", subtotal);

const resumen = calcularTotalConImpuesto(subtotal);

console.log("\nResumen de compra:");
console.log("Subtotal:", resumen.subtotal);
console.log("Impuesto (19%):", resumen.impuesto);
console.log("Total a pagar:", resumen.total);