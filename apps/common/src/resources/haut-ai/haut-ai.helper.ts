import { User } from '../../../../users/src/models';
import * as uuid from 'uuid';

export class HautAiHelper {
    static generateSubjectName(user: User): string {
        return `${user.id}_${user.firstName}_${user.lastName}_${uuid.v4()}`;
    }
}