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

    static parseEnumToArrayNumberValues(EnumObject: any) {
        const arrayStringValues = Object.keys(EnumObject).filter((v) => !isNaN(Number(v)));
        return arrayStringValues.map(arrayStringValues => Number(arrayStringValues));
    }
}