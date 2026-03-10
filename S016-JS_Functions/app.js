// 🔹 Function Declaration vs Function Expression
// ✅ Function Declaration
function saludar(nombre) {
    return `Hola, ${nombre}`;
}
console.log(saludar("Carlos"));

// ✅ Function Expression
// const saludar = function(nombre) {
//     return `Hola, ${nombre}`;
// };
// console.log(saludar("Ana"));


//🔹 Arrow Functions
// ✅ Forma normal
// const sumar = (a, b) => {
//     return a + b;
// };
// console.log(sumar(5, 3));

// // ✅ Forma simplificada
// const multiplicar = (a, b) => a * b;


// 🔹 Callbacks
// function procesarUsuario(nombre, callback) {
//     console.log("Procesando usuario...");
//     callback(nombre);
// }

// function mostrarUsuario(nombre) {
//     console.log(`Usuario: ${nombre}`);
// }

// procesarUsuario("Laura", mostrarUsuario);


// 🔹 Scope (Alcance de Variables)
// ✅ Scope Global
// let mensaje = "Hola Mundo";

// function mostrar() {
//     console.log(mensaje);
// }

// ✅ Scope Local
// function ejemplo() {
//     let numero = 10;
//     console.log(numero);
// }

// console.log(numero); // ❌ Error

// ✅ Scope de Bloque
// if (true) {
//     let dato = "JavaScript";
// }

// console.log(dato); // ❌ Error


// 🔹 Closures
// function contador() {
//     let cuenta = 0;

//     return function() {
//         cuenta++;
//         return cuenta;
//     };
// }
// const incrementar = contador();

// console.log(incrementar());
// console.log(incrementar());


// 🔹 IIFE (Immediately Invoked Function Expression)
// (function() {
//     console.log("Función ejecutada automáticamente");
// })();

// // ✅ Versión con arrow function
// (() => {
//     console.log("IIFE con arrow function");
// })();