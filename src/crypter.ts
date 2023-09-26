import CryptoJS from 'crypto-js'

class Crypter {
    static encrypt(value: string, secret: string): string {
        return CryptoJS.AES.encrypt(value, secret).toString()
    }

    static decrypt(encrypted: string, secret: string): string {
        return CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8)
    }
}

export default Crypter