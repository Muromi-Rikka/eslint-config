// Sample TypeScript file for testing

interface Person {
  age: number;
  name: string;
}

const people: Person[] = [
  { age: 30, name: "Alice" },
  { age: 25, name: "Bob" },
  { age: 35, name: "Charlie" },
];

const log = console.log;

for (const person of people) {
  log(`Hello, my name is ${person.name} and I am ${person.age} years old.`);
}

function identity<T>(argument: T): T {
  return argument;
}

const result = identity(
  "TypeScript is awesome",
);
log(result);

interface Car {
  make: string;
  model?: string;
}

const car1: Car = { make: "Toyota" };
const car2: Car = {
  make: "Ford",
  model: "Focus",
};

type Fruit = "apple" | "banana" | "orange";
const favoriteFruit: Fruit = "apple";

const inputValue: any = "42";
const numericValue = inputValue as number;

class Animal {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  protected makeSound(sound: string) {
    log(`${this.name} says ${sound}`);
  }
}

class Dog extends Animal {
  constructor(private alias: string) {
    super(alias);
  }

  bark() {
    this.makeSound("Woof!");
  }
}

const dog = new Dog("Buddy");
dog.bark();

function function_(): string {
  return `hello1`;
}

log(car1, car2, favoriteFruit, numericValue, function_());

export function* generator1() {
  let id = 0;
  while (id < 100) {
    yield id++;
  }
}
export function* generator2() {
  yield* generator1();
}
