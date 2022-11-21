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
    '`filterSexes`',
    '`filterAges`',
    '`filterOtherFeatures`',
    '`filterEthnicities`'
];

const countSubQuery = (biomarkerIds: number[]): string => `
    SELECT 
        \`filters\`.\`id\` as \`id\`,
        COUNT(\`filterSexes\`.\`id\`) as \`sexesCount\`,
        COUNT(\`filterAges\`.\`id\`) as \`agesCount\`,
        COUNT(\`filterEthnicities\`.\`id\`) as \`ethnicitiesCount\`,
        COUNT(\`filterOtherFeatures\`.\`id\`) as \`otherFeaturesCount\`
    FROM \`filters\`
    LEFT JOIN \`filterSexes\` ON \`filters\`.\`id\`=\`filterSexes\`.\`filterId\`
    LEFT JOIN \`filterAges\` ON \`filters\`.\`id\`=\`filterAges\`.\`filterId\`
    LEFT JOIN \`filterEthnicities\` ON \`filters\`.\`id\`=\`filterEthnicities\`.\`filterId\`
    LEFT JOIN \`filterOtherFeatures\` ON \`filters\`.\`id\`=\`filterOtherFeatures\`.\`filterId\`
    WHERE biomarkerId IN (${biomarkerIds.join(', ')})
    GROUP BY \`filters\`.\`id\`
`;

export function getSpecificFiltersQuery(biomarkerIds: number[], options: ISpecificFiltersQueryOptions): string {
    const otherFeaturesJoinWithAnd = `
        LEFT JOIN \`filterOtherFeatures\` ON \`filters\`.\`id\`=\`filterOtherFeatures\`.\`filterId\` 
            AND \`filterOtherFeatures\`.\`otherFeature\` ${options.otherFeature ? `= ${options.otherFeature}` : 'IS NULL'}
    `;

    const priorityQuery = priorityOrder
        .reverse()
        .reduce(
            (query, filterCharacteristic, index) => `IF(${filterCharacteristic}.\`id\` IS NOT NULL, ${index + 1}, ${query})`,
            '0'
        );

    const orderedFilters = `
        SELECT
            (
                IF(\`filterSexes\`.\`id\` IS NOT NULL, 1, 0)
                + IF(\`filterAges\`.\`id\` IS NOT NULL, 1, 0)
                + IF(\`filterEthnicities\`.\`id\` IS NOT NULL, 1, 0)
                + IF(\`filterOtherFeatures\`.\`id\` IS NOT NULL, 1, 0)
            ) as \`orderValue\`,
            ${priorityQuery} as \`priority\`,
            \`filters\`.\`id\` as \`id\`,
            \`filters\`.\`biomarkerId\ as \`biomarkerId\`,
            \`countedFilters\`.\`sexesCount\` as \`sexesCount\`,
            \`countedFilters\`.\`agesCount\` as \`agesCount\`,
            \`countedFilters\`.\`ethnicitiesCount\` as \`ethnicitiesCount\`
        FROM \`filters\`
        LEFT JOIN \`filterSexes\` ON \`filters\`.\`id\`=\`filterSexes\`.\`filterId\` 
            AND \`filterSexes\`.\`sex\`=${options.sexType}
        LEFT JOIN \`filterAges\` ON \`filters\`.\`id\`=\`filterAges\`.\`filterId\`
            AND \`filterAges\`.\`age\` IN ${options.ageTypes.join(', ')}
        LEFT JOIN \`filterEthnicities\` ON \`filters\`.\`id\`=\`filterEthnicities\`.\`filterId\`
            AND \`filterEthnicities\`.\`ethnicity\`=${options.ethnicityType}
        ${otherFeaturesJoinWithAnd}
        LEFT JOIN (${countSubQuery(biomarkerIds)}) AS \`countedFilters\` ON \`filters\`.\`id\`= \`countedFilters\`.\`id\`
        WHERE \`filters\`.\`biomarkerId\` IN (${biomarkerIds.join(', ')})
            AND (\`countedFilters\`.\`sexesCount\` != ${EnumHelper.toCollection(SexTypes).length} 
            OR \`countedFilters\`.\`agesCount\` != ${EnumHelper.toCollection(AgeTypes).length} 
            OR \`countedFilters\`.\`ethnicitiesCount\` != ${EnumHelper.toCollection(EthnicityTypes).length}
            OR \`countedFilters\`.\`otherFeaturesCount\` != ${EnumHelper.toCollection(OtherFeatureTypes).length})
            AND \`orderValue\` != 0
        ORDER BY \`orderValue\`, \`priority\` DESC
    `;

    return `
        SELECT 
            \`biomarkerFilters\`.\`id\` as \`id\`
        FROM (
            SELECT
                \`orderedFilters\`.\`id\` as \`id\`,
                \`orderedFilters\`.\`biomarkerId\` as \`biomarkerId\`,
            FROM (${orderedFilters}) as \`orderedFilters\`
            GROUP BY \`orderedFilters\`.\`biomarkerId\`
        ) as \`biomarkerFilters\`
    `;
} 

export function getFiltersAllQuery(biomarkerIds: number[]): string {
    return `
        SELECT
            \`filters\`.\`id\` as \`id\`
        FROM \`filters\`
        LEFT JOIN (${countSubQuery(biomarkerIds)}) AS \`countedFilters\` ON \`filters\`.\`id\`= \`countedFilters\`.\`id\`
        WHERE \`filters\`.\`biomarkerId\` IN (${biomarkerIds.join(', ')})
            AND \`countedFilters\`.\`sexesCount\` = ${EnumHelper.toCollection(SexTypes).length} 
            AND \`countedFilters\`.\`agesCount\` = ${EnumHelper.toCollection(AgeTypes).length} 
            AND \`countedFilters\`.\`ethnicitiesCount\` = ${EnumHelper.toCollection(EthnicityTypes).length}
            AND \`countedFilters\`.\`otherFeaturesCount\` = ${EnumHelper.toCollection(OtherFeatureTypes).length}
    `;
}
