import { resolve } from 'node:path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

class Tokens {

    static directory = resolve('storage')
    static file = resolve('storage', 'tokens.json')

    static ensureFile() {
        if (!existsSync(this.directory)) this.createDirectory()
        if (!existsSync(this.file)) this.saveFile({})
    }

    static createDirectory() {
        try {
            mkdirSync(this.directory)
        } catch (error) {
            console.error(error)
        }
    }

    static saveFile(object: object) {
        try {
            writeFileSync(this.file, JSON.stringify(object))
        } catch (error) {
            console.error(error)
        }
    }

    static loadFile() {
        this.ensureFile()
        const text = readFileSync(this.file, { encoding: 'utf8' })
        try {
            return JSON.parse(text)
        } catch (error) {
            this.saveFile({})
            return {}
        }
    }

}

export default Tokens