// Sample JavaScript file for testing

const log = console.log;

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
  }
}

const people = [
  new Person("Alice", 30),
  new Person("Bob", 25),
  new Person("Charlie", 35),
];

for (const person of people) {
  person.sayHello();
}

const { age, name } = people[0];
log(`${name} is ${age} years old.`);

const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4, 5];
log(newNumbers);

try {
  JSON.parse("invalid JSON");
}
catch (error) {
  console.error("Error:", error.message);
}

const isEven = number_ => number_ % 2 === 0;
const number = 7;
log(`${number} is ${isEven(number) ? "even" : "odd"}.`);

let a, b, c, d, foo;

if (a
  || b
  || c || d
  || (d && b)) {
  foo();
}
