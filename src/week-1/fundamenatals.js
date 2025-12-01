//variables.js
let age = 20;            // can be changed
const name = "Alice";    // cannot be changed
var city = "Paris";      // older way of declaring

console.log("Name:", name);
console.log("Age:", age);
console.log("City:", city);

//dataTypes.js
let number = 10;             // Number
let price = 99.99;           // Number
let message = "Hello JS";    // String
let isHappy = true;          // Boolean
let nothing = null;          // Null
let notDefined;              // Undefined
let person = { name: "Bob", age: 25 };  // Object
let colors = ["Red", "Green", "Blue"];  // Array

console.log(number);
console.log(price);
console.log(message);
console.log(isHappy);
console.log(nothing);
console.log(notDefined);
console.log(person);
console.log(colors);

//operators.js
let fruits = ["Apple", "Banana", "Mango"];

for (let fruit of fruits) {
    console.log(fruit);
}

//functions.js
function addNumbers(a, b) {
    return a + b;
}

let result = addNumbers(5, 7);
console.log("Sum =", result);

