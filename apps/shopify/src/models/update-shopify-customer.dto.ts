import { SexTypes } from '../../../common/src/resources/filters/sex-types';
import { User } from '../../../users/src/models';
import { CustomerMetafieldDto } from './customer-metafield.dto';

export class UpdateShopifyCustomerDto {
    constructor(user: User) {
        this.first_name = user.firstName;
        this.last_name = user.lastName;
        this.metafields = [];
        if (user?.additionalField?.sex) {
            let value = SexTypes[user?.additionalField?.sex];
            value = value.charAt(0).toUpperCase() + value.slice(1);
            this.metafields.push(new CustomerMetafieldDto('gender', JSON.stringify([value]), 'list.single_line_text_field', 'custom'));
        }
        if (user?.additionalField?.dateOfBirth) {
            this.metafields.push(new CustomerMetafieldDto('date_of_birth', user?.additionalField?.dateOfBirth, 'date', 'custom'));
        }
        if (user?.additionalField?.isSelfAssesmentQuizCompleted) {
            this.metafields.push(new CustomerMetafieldDto('self_assessment_quiz_completed', user?.additionalField?.isSelfAssesmentQuizCompleted, 'boolean', 'custom'));
        }
    }

    readonly first_name: string;
    readonly last_name: string;
    readonly metafields: Array<CustomerMetafieldDto>;
}