import { DEFAULT_TOKEN_DURATION } from './constants.js'
import Crypter from './crypter.js'
import Storage from './storage.js'
import { randomBytes } from 'node:crypto'

interface SignOptions {
    duration: number | string
}

class Tokenman {

    static #list = Storage.load()

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
            duration: options.duration,
            created: Date.now()
        }
        Storage.save(this.#list)
        return token
    }

    static verify(token: string, secret: string, callback?: Function) {
        const item = this.#list[token]
        let error, data
        if (item) {
            if (item.duration === 'forever' || item.created + item.duration > Date.now()) {
                data = Crypter.decrypt(item.data, secret)
                if (data.length) {
                    try {
                        data = JSON.parse(data)
                    } catch (_error) {
                        error = _error
                    }
                } else {
                    error = new Error('Wrong secret key.')
                }
            } else {
                delete this.#list[token]
                Storage.save(this.#list)
                error = new Error('Token expired.')
            }
        } else {
            error = new Error('Unexisting token.')
        }
        if (callback) {
            callback(error, data)
        } else {
            if (error) throw error
            return data
        }
    }

    static delete(token: string) {
        if (this.#list[token]) {
            return delete this.#list[token]
        }
        return false
    }

}

export default Tokenman