// Variables (let, const, var)
// var (Forma tradicional)
var nombre = "Carlos";
var nombre = "Miguel"; // Permite redeclarar (no recomendado)

console.log(nombre);

// let (Forma moderna recomendada)
let edad = 25;
edad = 26;

console.log(edad);

// const (Constante)
const PI = 3.1416;

console.log(PI);


// Tipos de Datos
// Tipos primitivos
let nombre = "Ana";        // String
let edad = 30;             // Number
let activo = true;         // Boolean
let dato = null;           // Null
let indefinido;            // Undefined
let simbolo = Symbol();    // Symbol

// Tipo Complejo (Objeto)
let persona = {
    nombre: "Luis",
    edad: 28
};

let numeros = [1, 2, 3, 4];

// Verificar el tipo de dato
console.log(typeof nombre);
console.log(typeof edad);


// Operadores
// Operadores Aritméticos
let suma = 5 + 3;
let resta = 10 - 2;
let multiplicacion = 4 * 2;
let division = 20 / 4;
let modulo = 10 % 3;

// Operadores de Comparación
console.log(5 == "5");   // true (solo compara valor)
console.log(5 === "5");  // false (compara valor y tipo)
console.log(8 > 3);
console.log(4 <= 4);

// Operadores Lógicos
let edad = 20;
let tieneLicencia = true;

console.log(edad >= 18 && tieneLicencia);
console.log(edad < 18 || tieneLicencia);
console.log(!tieneLicencia);


// Condicionales
// if - else
let temperatura = 30;

if (temperatura > 25) {
    console.log("Hace calor");
} else {
    console.log("Hace frío");
}

// else if
let nota = 4.2;

if (nota >= 4.5) {
    console.log("Excelente");
} else if (nota >= 3.0) {
    console.log("Aprobado");
} else {
    console.log("Reprobado");
}

// switch
let dia = 2;

switch (dia) {
    case 1:
        console.log("Lunes");
        break;
    case 2:
        console.log("Martes");
        break;
    default:
        console.log("Otro día");
}


// Loops (Ciclos)
// for 
for (let i = 0; i < 5; i++) {
    console.log("Número:", i);
}

// while
let contador = 0;

while (contador < 3) {
    console.log(contador);
    contador++;
}

// do...while
let numero = 0;

do {
    console.log(numero);
    numero++;
} while (numero < 3);

// for...of (Recorrer arreglos)
let frutas = ["Manzana", "Pera", "Mango"];

for (let fruta of frutas) {
    console.log(fruta);
}