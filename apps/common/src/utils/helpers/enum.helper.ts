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

    static toCollection(enumObject: any): CollectionDto[] {
        const resultArray = [];
        for (const enumMember in enumObject) {
            const isValue = Number(enumMember) >= 0;
            if (!isValue) {
                break;
            }
            resultArray.push(new CollectionDto(enumObject[enumMember], parseInt(enumMember)));
        }

        return resultArray;
    }
}