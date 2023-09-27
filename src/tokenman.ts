import { DEFAULT_TOKEN_DURATION } from './constants.js'
import Crypter from './crypter.js'
import Storage from './storage.js'
import { randomBytes } from 'node:crypto'

interface SignOptions {
    duration: number | string
}

class Tokenman {

    static #items = this.#filter(Storage.load())

    static #generateToken(): string {
        const token = randomBytes(32).toString('hex')
        if (this.#items[token]) {
            return this.#generateToken()
        } else {
            return token
        }
    }

    static #filter(object: object) {
        return Object.fromEntries(Object.entries(object).filter(([, item]) => item.duration === 'forever' || item.created + item.duration > Date.now()))
    }

    static sign(data: object, secret: string, options: SignOptions = { duration: DEFAULT_TOKEN_DURATION }, callback?: (token: string) => void): string {
        const encrypted = Crypter.encrypt(JSON.stringify(data), secret)
        const token = this.#generateToken()

        this.#items[token] = {
            data: encrypted,
            duration: options.duration,
            created: Date.now()
        }

        Storage.save(this.#items)

        if (callback) callback(token)
        return token
    }

    static verify(token: string, secret: string, callback?: (error: Error | null, data: object | null) => void): object | null {
        this.#items = this.#filter(this.#items)
        Storage.save(this.#items)

        const item = this.#items[token]

        let error: Error | null = null, data: object | null = null

        if (item) {
            const decrypted = Crypter.decrypt(item.data, secret)
            if (decrypted.length) {
                try {
                    data = JSON.parse(decrypted)
                } catch (_error) {
                    error = _error as Error
                }
            } else {
                error = new Error('Wrong secret key.')
            }
        } else {
            error = new Error('Unexisting or expired token.')
        }

        if (callback) {
            callback(error, data)
        } else {
            if (error) throw error
        }

        return data
    }

    static delete(token: string): boolean {
        if (this.#items[token]) {
            delete this.#items[token]
            Storage.save(this.#items)
            return true
        }
        return false
    }

}

export default Tokenman