import { AgeTypes } from '../filters/age-types';
import { EthnicityTypes } from '../filters/ethnicity-types';
import { OtherFeatureTypes } from '../filters/other-feature-types';
import { SexTypes } from '../filters/sex-types';

interface IQueryOptions {
    sexType: SexTypes,
    ageType: AgeTypes,
    ethnicityType: EthnicityTypes,
    otherFeature: OtherFeatureTypes
}

const priorityOrder = [
    '`filterSexes`',
    '`filterAges`',
    '`filterEthnicities`'
];

export function filterSqlQuery(biomarkerIds: number[], options: IQueryOptions): string {
    const otherFeaturesJoin = '', otherFeaturesCount = '', otherFeaturesJoinWithAnd = '';

    /*if (options.otherFeature) {
        otherFeaturesJoin = `
            LEFT JOIN \`filterOtherFeatures\` ON \`filters\`.\`id\`=\`filterOtherFeatures\`.\`filterId\`
        `;
        otherFeaturesJoinWithAnd = `${otherFeaturesJoin} AND \`filterOtherFeatures\`.\`otherFeature\`=${options.otherFeature}`;
        otherFeaturesCount = 'COUNT(`filterOtherFeatures`.`id`) as `otherFeaturesCount`,';
    }*/

    const countSubQuery = `
        SELECT 
            \`filters\`.\`id\` as \`id\`,
            COUNT(\`filterSexes\`.\`id\`) as \`sexesCount\`,
            COUNT(\`filterAges\`.\`id\`) as \`agesCount\`,
            COUNT(\`filterEthnicities\`.\`id\`) as \`ethnicitiesCount\`
        FROM \`filters\`
        LEFT JOIN \`filterSexes\` ON \`filters\`.\`id\`=\`filterSexes\`.\`filterId\`
        LEFT JOIN \`filterAges\` ON \`filters\`.\`id\`=\`filterAges\`.\`filterId\`
        LEFT JOIN\`filterEthnicities\` ON \`filters\`.\`id\`=\`filterEthnicities\`.\`filterId\`
        WHERE biomarkerId IN (${biomarkerIds.join(', ')})
        GROUP BY \`filters\`.\`id\`
    `;

    const priorityQuery = priorityOrder
        .reverse()
        .reduce(
            (query, filterCharacteristic, index) => `IF(${filterCharacteristic}.\`id\` IS NOT NULL, ${index + 1}, ${query})`,
            '0'
        );

    return `
        SELECT
            (
                IF(\`filterSexes\`.\`id\` IS NOT NULL, 1, 0)
                + IF(\`filterAges\`.\`id\` IS NOT NULL, 1, 0)
                + IF(\`filterEthnicities\`.\`id\` IS NOT NULL, 1, 0)
            ) as \`orderValue\`,
            ${priorityQuery} as \`priority\`,
            \`filters\`.\`id\`,
            \`countedFilters\`.\`sexesCount\` as \`sexesCount\`,
            \`countedFilters\`.\`agesCount\` as \`agesCount\`,
            \`countedFilters\`.\`ethnicitiesCount\` as \`ethnicitiesCount\`
        FROM \`filters\`
        LEFT JOIN \`filterSexes\` ON \`filters\`.\`id\`=\`filterSexes\`.\`filterId\` 
            AND \`filterSexes\`.\`sex\`=${options.sexType}
        LEFT JOIN \`filterAges\` ON \`filters\`.\`id\`=\`filterAges\`.\`filterId\`
            AND \`filterAges\`.\`age\`=${options.ageType}
        LEFT JOIN \`filterEthnicities\` ON \`filters\`.\`id\`=\`filterEthnicities\`.\`filterId\`
            AND \`filterEthnicities\`.\`ethnicity\`=${options.ethnicityType}
        LEFT JOIN (${countSubQuery}) AS \`countedFilters\` ON \`filters\`.\`id\`= \`countedFilters\`.\`id\`
        ORDER BY \`orderValue\`, \`priority\` DESC
    `;
} 
