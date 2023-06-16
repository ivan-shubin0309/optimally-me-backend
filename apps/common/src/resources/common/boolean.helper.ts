export class BooleanHelper {
    static parseBooleanFromCsv(value: string): boolean {
        if (value === 'TRUE' || value === 'FALSE') {
            return value === 'TRUE' ? true : false;
        }

        return null;
    }
}