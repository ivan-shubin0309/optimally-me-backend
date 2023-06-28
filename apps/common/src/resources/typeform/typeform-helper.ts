export interface ITypeformAnswer { questionId: string, questionText: string, answerType: string, answerText: string }

class DataParser {
    static number(answer: { type: string, number: number, field: any }): number {
        return answer?.number;
    }

    static boolean(answer: { type: string, boolean: boolean, field: any }): boolean {
        return answer?.boolean;
    }

    static choice(answer: { type: string, choice: { label: string }, field: any }): string {
        return answer?.choice?.label;
    }

    static choices(answer: { type: string, choice: { labels: string[] }, field: any }): string {
        return answer?.choice?.labels?.join(', ');
    }
}

export class TypeformHelper {
    static getQuizName(body: any): string {
        return body?.form_response?.definition?.title;
    }

    static getUserEmail(body: any): string {
        return body?.form_response?.hidden?.email?.replace(' ', '+');
    }

    static getFormId(body: any): string {
        return body?.form_response?.form_id;
    }

    static getAnswers(body: any): ITypeformAnswer[] {
        const answers = [];
        const bodyAnswers = body?.form_response?.answers;

        if (!bodyAnswers) {
            return answers;
        }

        bodyAnswers.forEach(answer => {
            const result: any = {};
            if (DataParser[answer.type]) {
                result.answerText = DataParser[answer.type](answer);
            } else {
                result.answerText = null;
            }

            result.questionId = answer?.field?.id;
            result.answerType = answer?.type;

            answers.push(result);
        });

        const questionsMap = {};
        body?.form_response?.definition?.fields.forEach(field => {
            questionsMap[field.id] = field;
        });

        answers.forEach(answer => {
            answer.questionText = questionsMap[answer.questionId].title;
        });

        return answers;
    }

    static getSubmittedAt(body: any): string {
        return body?.form_response?.submitted_at;
    }

    static getVariables(body: any): { key: string, type: string, value: string | number }[] {
        return body?.form_response?.variables?.map(variable => ({
            key: variable.key,
            type: variable.type,
            value: variable[variable.type]
        }));
    }
}