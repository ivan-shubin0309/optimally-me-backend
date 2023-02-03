import { titleToQuizType } from './typeform-quiz-types';

export class TypeformHelper {
    static getQuizType(body: any): number | null {
        return titleToQuizType[body?.form_response?.definition?.title] || null;
    }

    static getQuizName(body: any): string {
        return body?.form_response?.definition?.title;
    }

    static getUserEmail(body: any): string {
        const answersArray: any[] = body?.form_response?.answers;

        if (!answersArray) {
            return null;
        }

        const answer = answersArray.find(answer => answer.type === 'email');

        return answer.email;
    }

    static getFormId(body: any): string {
        return body?.form_response?.form_id;
    }
}