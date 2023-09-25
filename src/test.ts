import Tokenman from './tokenman.js'

const token1 = Tokenman.sign({id: 1}, '', {duration: 30})

Tokenman.sign({id: 2}, '')