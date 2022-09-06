export interface ICreateUser {
    readonly email: string,
    readonly password?: string,
    readonly firstName?: string,
    readonly lastName?: string,
    readonly role?: number
}