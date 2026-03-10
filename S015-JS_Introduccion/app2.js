// Desarrollar un programa que:

// 1. Declare variables para:
//     - Nombre
//     - Edad
//     - Ciudad
// 2. Verifique si la persona es mayor de edad.
// 3. Muestre un mensaje diferente dependiendo del resultado.
// 4. Use un ciclo para mostrar los números del 1 al 10.

let nombre = "Miguel"
let edad = 20
let ciudad = "Sabaneta"

console.log("Nombre:", nombre)
console.log("Edad:", edad)
console.log("Ciudad:", ciudad)

if (edad >= 18) {
    // bloque de codigo o instrucciones si la condicion se cumple (es verdadera/true)
    console.log("Si es mayor de edad!")
} else {
    console.log("No es mayor de edad!")
}

//            pos 0, pos 1,     pos 2
//let frutas = ["uva", "manzana", "melocoton"]

for (let i = 1; i <= 10; i++) {
    // el bloque de codigo o instrucciones que se ejecutaran un numero finito de veces
    console.log("Numero:", i)
}


