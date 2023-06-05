export enum BiomarkerTypes {
    blood = 1,
    bloodRule = 2,
    skin = 3,
    skinRule = 4,
    dnaAge = 5,
    dnaAgeRule = 6,
}

export const ruleTypes = [
    BiomarkerTypes.bloodRule,
    BiomarkerTypes.skinRule,
    BiomarkerTypes.dnaAgeRule,
];

export const allowedCategoriesByRule = {
    [BiomarkerTypes.bloodRule]: [
        'Biochemistry',
        'Liver Function',
        'Cholesterol (Lipids)',
        'Haematinics',
        'Thyroid Function',
        'Vitamins',
        'Hormones',
        'Kidney Function',
        'Full Blood Count',
        'Bone Screen',
        'Minerals',
    ],
    [BiomarkerTypes.skinRule]: ['Skin'],
    [BiomarkerTypes.dnaAgeRule]: ['DNAm age']
};