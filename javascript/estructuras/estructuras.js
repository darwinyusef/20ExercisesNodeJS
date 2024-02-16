// Estructuras de control secuenciales
console.log("Estructuras de control secuenciales:");

// Secuencial
let a = 5;
let b = 10;
let c = a + b;
console.log("La suma de a y b es:", c);

// Estructuras de control condicionales (if-else)
console.log("\nEstructuras de control condicionales (if-else):");

let edad = 18;
if (edad >= 18) {
    console.log("Eres mayor de edad.");
} else {
    console.log("Eres menor de edad.");
}

// Switch
console.log("\nSwitch:");

let dia = 3;
let nombreDia;
switch (dia) {
    case 1:
        nombreDia = "Lunes";
        break;
    case 2:
        nombreDia = "Martes";
        break;
    case 3:
        nombreDia = "Miércoles";
        break;
    default:
        nombreDia = "Día no válido";
}
console.log("Hoy es", nombreDia);

// Bucles
console.log("\nBucles:");

// For loop
console.log("For loop:");
for (let i = 0; i < 5; i++) {
    console.log("Iteración", i);
}

// While loop
console.log("\nWhile loop:");
let contador = 0;
while (contador < 5) {
    console.log("Contador:", contador);
    contador++;
}

// Do-while loop
console.log("\nDo-while loop:");
let x = 0;
do {
    console.log("Valor de x:", x);
    x++;
} while (x < 5);