import { PutReactRecommendationDto } from '../../../../users-results/src/models/put-react-recommendation.dto';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { RecommendationReactionTypes } from './reaction-types';

export function DescriptionRequired(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'DescriptionRequired',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments): boolean {
                    const obj = args.object as PutReactRecommendationDto;
                    if (obj.reactionType === RecommendationReactionTypes.dislike) {
                        return !!value;
                    }
                    if (obj.reactionType === RecommendationReactionTypes.like) {
                        return !value;
                    }
                    return true;
                },
                defaultMessage(args: ValidationArguments): string {
                    return `${args.property} is only required when reactionType is ${RecommendationReactionTypes.dislike}`;
                },
            },
        });
    };
}