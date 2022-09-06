import * as crypto from 'crypto';

export class PasswordHelper {
    static hash(password: string): string {
        return crypto.createHash('md5').update(password).digest('hex');
    }

    static compare(password: string, hashedPassword: string): boolean {
        return crypto.createHash('md5').update(password).digest('hex') === hashedPassword;
    }

    static generateSalt(): string {
        return crypto.randomBytes(16).toString('hex');
    }
}
