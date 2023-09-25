import { DEFAULT_TOKEN_DURATION } from './constants.js'
import Tokens from './tokens.js'

interface SignOptions {
    duration: number | string
}

class Tokenman {

    static sign(data: object, secret: string, options: SignOptions = { duration: DEFAULT_TOKEN_DURATION }, callback?: Function) {
        Tokens.ensureFile()
    }

    static verify(token: string, secret: string, callback?: Function) {

    }

}

export default Tokenman