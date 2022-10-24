import { CollectionDto } from '../../models/enum-collecction.dto';

export class EnumHelper {
    static toDescription(enumObject: any, label = 'Supported values'): string {
        let description = `${label}: `;
        for (const enumMember in enumObject) {
            const isValue = Number(enumMember) >= 0;
            if (!isValue) {
                break;
            }
            description = `${description}<br/>&emsp;${enumObject[enumMember]} - ${enumMember}`;
        }
        return description;
    }

    static toCollection(enumObject: any, clientValues?: any): CollectionDto[] {
        const resultArray = [];
        for (const enumMember in enumObject) {
            const isValue = Number(enumMember) >= 0;
            if (!isValue) {
                break;
            }
            resultArray.push(new CollectionDto(clientValues ? clientValues[enumMember] : enumObject[enumMember], parseInt(enumMember)));
        }

        return resultArray;
    }

    static toOrderByKeys(enumObject: any, orderType: 'desc' | 'asc' = 'desc'): CollectionDto[] {
        let collection = EnumHelper.toCollection(enumObject);

        collection = collection.sort((obj1, obj2) => obj1.key.localeCompare(obj2.key));

        return orderType === 'desc' ? collection : collection.reverse();
    }
}