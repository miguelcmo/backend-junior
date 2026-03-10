// ### Requisitos

// 1. Crear una función llamada `calcularEdad` que:
//     - Reciba el año de nacimiento.
//     - Reciba el año actual.
//     - Retorne la edad de la persona.
// 2. Crear otra función llamada `mostrarEdad` que:
//     - Reciba el nombre de la persona.
//     - Reciba la edad calculada.
//     - Muestre un mensaje en consola con la información.
// 3. Ejecutar las funciones con al menos dos personas diferentes.

function calcularEdad(añoNacimiento, añoActual) {
    let calculo = añoActual - añoNacimiento 
    return calculo
}

const calculoEdad = function(añoNacimiento, añoActual) {
    return añoActual - añoNacimiento
}

function mostrarEdad(nombre, edad) {
    console.log(`Hola ${nombre}, tienes ${edad} años.`)
}

let edadPersona = calcularEdad(1983, 2026)
mostrarEdad("Miguel", edadPersona)

mostrarEdad("Miguel", calculoEdad(1983, 2026))
