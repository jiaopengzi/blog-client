const dataOfUpdate = { name: "John", age: 25, country: "USA" }
const updatedFields = { age: 26, country: "Canada" }

Object.assign(dataOfUpdate, updatedFields)

console.log(dataOfUpdate)
