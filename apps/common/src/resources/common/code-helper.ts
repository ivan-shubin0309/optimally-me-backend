const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const digits = '0123456789';

export class CodeHelper {
    static generateCode(length: number): string {
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    static generateDigitCode(length: number): string {
        let result = '';
        const charactersLength = digits.length;
        for (let i = 0; i < length; i++) {
            result += digits.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }
}