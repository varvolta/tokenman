import Tokenman from './tokenman.js'
const token = Tokenman.sign({ id: 1 }, '', { duration: 30 })
const obj = Tokenman.verify(token, '')

console.log(token, obj)