export interface ICreateProfile {
    readonly url?: string,
    readonly public_id?: string,
    readonly given_name?: string,
    readonly family_name?: string,
    readonly nickname?: string
    readonly gender?: string
    readonly birthdate?: string
    readonly zoneinfo?: string
    readonly locale?: string
    readonly reference?: string
    readonly avatar?: string
    readonly bearer?: string
}