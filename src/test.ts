import Tokenman from './tokenman.js'
const token1 = Tokenman.sign({ id: 1 }, '', { duration: 3000000 })
const obj1 = Tokenman.verify(token1, '')

console.log(token1, obj1)

const token2 = Tokenman.sign({ id: 1 }, '', { duration: 30 })
setTimeout(() => {
    // try {
    //     const obj2 = Tokenman.verify(token2, '')
    //     console.log(token2, obj2)
    // } catch (error) {
    //     console.error(token2, error)
    // }
    Tokenman.verify(token2, '', (error, data) => {
        console.log(error, data)
    })
}, 40)
