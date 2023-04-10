import { EnumHelper } from '../../utils/helpers/enum.helper';
import { AgeTypes } from '../filters/age-types';
import { EthnicityTypes } from '../filters/ethnicity-types';
import { OtherFeatureTypes } from '../filters/other-feature-types';
import { SexTypes } from '../filters/sex-types';

export interface ISpecificFiltersQueryOptions {
    sexType: SexTypes,
    ageTypes: AgeTypes[],
    ethnicityType: EthnicityTypes,
    otherFeature: OtherFeatureTypes
}

const priorityOrder = [
    'filterSexes',
    'filterAges',
    'filterOtherFeatures',
    'filterEthnicities'
];

const countSubQuery = (biomarkerIds: number[], tableName: string): string => `
    SELECT 
        \`filters\`.\`id\` as \`id\`,
        COUNT(\`${tableName}\`.\`id\`) as \`counter\`
    FROM \`filters\`
    LEFT JOIN \`${tableName}\` ON \`filters\`.\`id\`=\`${tableName}\`.\`filterId\`
    WHERE \`biomarkerId\` IN (${biomarkerIds.join(', ')})
    GROUP BY \`filters\`.\`id\`
`;

const countersJoinQuery = (biomarkerIds: number[]): string => {
    return priorityOrder
        .reduce(
            (query, filterCharacteristic) => `${query} LEFT JOIN (${countSubQuery(biomarkerIds, filterCharacteristic)}) AS \`${filterCharacteristic}Count\` ON \`filters\`.\`id\`= \`${filterCharacteristic}Count\`.\`id\``,
            ''
        );
};

export function getSpecificFiltersQuery(biomarkerIds: number[], options: ISpecificFiltersQueryOptions): string {
    const otherFeaturesJoinWithAnd = `
        LEFT JOIN \`filterOtherFeatures\` ON \`filters\`.\`id\`=\`filterOtherFeatures\`.\`filterId\` 
            AND \`filterOtherFeatures\`.\`otherFeature\` ${options.otherFeature ? `= ${options.otherFeature}` : 'IS NULL'}
    `;

    const priorityQuery = [...priorityOrder]
        .reverse()
        .reduce(
            (query, filterCharacteristic, index) => `IF(\`${filterCharacteristic}\`.\`id\` IS NOT NULL, ${index + 1}, ${query})`,
            '0'
        );

    const orderValue = `(
        IF(\`filterSexes\`.\`id\` IS NOT NULL, 1, 0)
        + IF(\`filterAges\`.\`id\` IS NOT NULL, 1, 0)
        + IF(\`filterEthnicities\`.\`id\` IS NOT NULL, 1, 0)
        + IF(\`filterOtherFeatures\`.\`id\` IS NOT NULL, 1, 0)
    )`;

    const orderedFilters = `
        SELECT
            ${orderValue} as \`orderValue\`,
            ${priorityQuery} as \`priority\`,
            \`filters\`.\`id\` as \`id\`,
            \`filters\`.\`biomarkerId\` as \`biomarkerId\`,
            \`filterSexesCount\`.\`counter\` as \`sexesCount\`,
            \`filterAgesCount\`.\`counter\` as \`agesCount\`,
            \`filterEthnicitiesCount\`.\`counter\` as \`ethnicitiesCount\`,
            \`filterOtherFeaturesCount\`.\`counter\` as \`otherFeaturesCount\`
        FROM \`filters\`
        LEFT JOIN \`filterSexes\` ON \`filters\`.\`id\`=\`filterSexes\`.\`filterId\` 
            AND \`filterSexes\`.\`sex\`=${options.sexType}
        LEFT JOIN \`filterAges\` ON \`filters\`.\`id\`=\`filterAges\`.\`filterId\`
            AND \`filterAges\`.\`age\` IN (${options.ageTypes.join(', ')})
        LEFT JOIN \`filterEthnicities\` ON \`filters\`.\`id\`=\`filterEthnicities\`.\`filterId\`
            AND \`filterEthnicities\`.\`ethnicity\`=${options.ethnicityType}
        ${otherFeaturesJoinWithAnd}
        ${countersJoinQuery(biomarkerIds)}
        WHERE \`filters\`.\`biomarkerId\` IN (${biomarkerIds.join(', ')})
            AND (\`filterSexesCount\`.\`counter\` != ${EnumHelper.toCollection(SexTypes).length} 
            OR \`filterAgesCount\`.\`counter\` != ${EnumHelper.toCollection(AgeTypes).length} 
            OR \`filterEthnicitiesCount\`.\`counter\` != ${EnumHelper.toCollection(EthnicityTypes).length}
            OR \`filterOtherFeaturesCount\`.\`counter\` != ${EnumHelper.toCollection(OtherFeatureTypes).length})
            AND ${orderValue} != 0
        ORDER BY \`orderValue\` DESC, \`priority\` DESC
    `;

    return `
        SELECT 
            \`biomarkerFilters\`.\`id\` as \`id\`
        FROM (
            SELECT
                \`orderedFilters\`.\`id\` as \`id\`,
                \`orderedFilters\`.\`biomarkerId\` as \`biomarkerId\`
            FROM (${orderedFilters}) as \`orderedFilters\`
            GROUP BY \`orderedFilters\`.\`biomarkerId\`
        ) as \`biomarkerFilters\`
    `.replace(/\s+/ig, ' ').trim();
} 

export function getFiltersAllQuery(biomarkerIds: number[]): string {
    return `
        SELECT
            \`filters\`.\`id\` as \`id\`
        FROM \`filters\`
        ${countersJoinQuery(biomarkerIds)}
        WHERE \`filters\`.\`biomarkerId\` IN (${biomarkerIds.join(', ')})
            AND \`filterSexesCount\`.\`counter\` = ${EnumHelper.toCollection(SexTypes).length} 
            AND \`filterAgesCount\`.\`counter\` = ${EnumHelper.toCollection(AgeTypes).length} 
            AND \`filterEthnicitiesCount\`.\`counter\` = ${EnumHelper.toCollection(EthnicityTypes).length}
            AND \`filterOtherFeaturesCount\`.\`counter\` = ${EnumHelper.toCollection(OtherFeatureTypes).length}
    `.replace(/\s+/ig, ' ').trim();
}
