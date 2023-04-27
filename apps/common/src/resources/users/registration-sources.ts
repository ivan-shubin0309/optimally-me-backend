export enum RegistrationSources {
    mirrorMirror = 1,
    shopify = 2,
    kitActivation = 3,
}

export const registrationSourceClientValue = {
    [RegistrationSources.mirrorMirror]: 'MirrorMirror',
    [RegistrationSources.shopify]: 'Shopify',
    [RegistrationSources.kitActivation]: 'KitActivation',
};