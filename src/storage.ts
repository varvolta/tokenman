import { resolve } from 'node:path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

class Storage {

    static directory = resolve('storage')
    static file = resolve('storage', 'tokens.json')

    static ensure() {
        if (!existsSync(this.directory)) this.create()
        if (!existsSync(this.file)) this.save({})
    }

    static create() {
        try {
            mkdirSync(this.directory)
        } catch (error) {
            throw error
        }
    }

    static save(object: object) {
        try {
            writeFileSync(this.file, JSON.stringify(object))
        } catch (error) {
            throw error
        }
    }

    static load() {
        this.ensure()
        const text = readFileSync(this.file, { encoding: 'utf8' })
        try {
            return JSON.parse(text)
        } catch (error) {
            console.error(error)
            this.save({})
            return {}
        }
    }

}

export default Storage