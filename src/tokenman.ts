import { DEFAULT_TOKEN_DURATION } from './constants.js'
import Crypter from './crypter.js'
import Tokens from './tokens.js'
import { randomBytes } from 'node:crypto'

interface SignOptions {
    duration: number | string
}

class Tokenman {

    static #list = Tokens.loadFile()

    static #generateToken(): string {
        const token = randomBytes(32).toString('hex')
        if (this.#list[token]) {
            return this.#generateToken()
        } else {
            return token
        }
    }

    static sign(data: object, secret: string, options: SignOptions = { duration: DEFAULT_TOKEN_DURATION }, callback?: Function): string {
        const encrypted = Crypter.encrypt(JSON.stringify(data), secret)
        const token = this.#generateToken()
        this.#list[token] = {
            data: encrypted,
            duration: options.duration
        }
        Tokens.saveFile(this.#list)
        return token
    }

    static verify(token: string, secret: string, callback?: Function) {
        const payload = this.#list[token]
        if (payload) {
            let decrypted = Crypter.decrypt(payload.data, secret)
            if (decrypted.length) {
                try {
                    decrypted = JSON.parse(decrypted)
                } catch (error) {
                    console.error(error)
                }
                if (callback) {
                    callback(null, decrypted)
                } else {
                    return decrypted
                }
            } else {
                if (callback) {
                    callback(new Error('Wrong secret key.'), null)
                } else {
                    throw new Error('Wrong secret key.')
                }
            }
        } else {
            if (callback) {
                callback(new Error('Unexisting token.'), null)
            } else {
                throw new Error('Unexisting token.')
            }
        }
    }

}

export default Tokenman