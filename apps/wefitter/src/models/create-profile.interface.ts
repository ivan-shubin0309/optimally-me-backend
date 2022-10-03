export interface ICreateProfile {
    readonly url?: string,
    readonly public_id?: string,
    readonly given_name?: string,
    readonly family_name?: string,
    readonly nickname?: number
    readonly gender?: number
    readonly birthdate?: number
    readonly zoneinfo?: number
    readonly locale?: number
    readonly reference?: number
    readonly avatar?: number
    readonly bearer?: number
}