import { resolve } from 'node:path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

class Tokens {

    static directory = resolve('storage')
    static file = resolve('storage', 'tokens.json')

    static ensureFile() {
        if (!existsSync(this.directory)) mkdirSync(this.directory)
        if (!existsSync(this.file)) writeFileSync(this.file, '{}')
    }

}

export default Tokens