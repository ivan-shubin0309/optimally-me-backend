import { Body, Controller, Headers, HttpStatus, Inject, Post, RawBodyRequest, Req, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TypeformHelper } from '../../common/src/resources/typeform/typeform-helper';
import { TranslatorService } from 'nestjs-translator';
import { Public } from '../../common/src/resources/common/public.decorator';
import { TypeformEventResponseDto } from './models/typeform-event-response.dto';
import { TypeformService } from './typeform.service';
import { UserQuizesService } from './user-quizes.service';
import { UsersService } from '../../users/src/users.service';
import { UserQuizAnswersService } from './user-quiz-answers.service';
import { Sequelize } from 'sequelize-typescript';
import { UserRoles } from '../../common/src/resources/users';
import { TypeformQuizType } from '../../common/src/resources/typeform/typeform-quiz-types';
import { DecisionRulesService } from './decision-rules.service';
import { ShopifyService } from '../../shopify/src/shopify.service';

@ApiTags('typeform')
@Controller('typeform')
export class TypeformController {
    constructor(
        private readonly typeformService: TypeformService,
        private readonly translator: TranslatorService,
        private readonly userQuizesService: UserQuizesService,
        private readonly usersService: UsersService,
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
        private readonly userQuizAnswersService: UserQuizAnswersService,
        private readonly decisionRulesService: DecisionRulesService,
        private readonly shopifyService: ShopifyService,
    ) { }

    @Public()
    @ApiOperation({ summary: 'Sensitive quiz webhook' })
    @Post('/sensitive-quiz')
    async handleSensitiveQuizEvent(@Body() body: Record<string, any>, @Headers('Typeform-Signature') signature, @Req() req: RawBodyRequest<Request>): Promise<TypeformEventResponseDto> {
        console.log(JSON.stringify(body));
        const response = this.typeformService.checkSignatureAndUserEmail(signature, req.rawBody, body, this.translator);
        
        if (typeof response !== 'string') {
            return response;
        }

        const user = await this.usersService.getOne([
            { method: ['byEmail', response] },
            { method: ['byRoles', UserRoles.user] },
            { method: ['withAdditionalField'] }
        ]);

        if (!user) {
            return new TypeformEventResponseDto(
                'USER_NOT_FOUND',
                this.translator.translate('USER_NOT_FOUND')
            );
        }

        await this.dbConnection.transaction(async transaction => {
            const userQuiz = await this.userQuizesService.create(
                {
                    userId: user.id,
                    quizType: TypeformQuizType.sensitiveSkin,
                    typeformFormId: TypeformHelper.getFormId(body),
                    submittedAt: TypeformHelper.getSubmittedAt(body),
                },
                transaction
            );

            const variables = TypeformHelper.getVariables(body);

            const answers = TypeformHelper.getAnswers(body);
            const answersToCreate = answers.map(answer => Object.assign({ userId: user.id, quizId: userQuiz.id }, answer));

            await this.userQuizAnswersService.bulkCreate(answersToCreate, transaction);

            await this.typeformService.saveSensitiveQuizParameters(user, variables, transaction);

            await this.decisionRulesService.updateUserRecommendations(user.id, body.form_response, transaction);
        });

        return new TypeformEventResponseDto(null, null);
    }

    @Public()
    @ApiOperation({ summary: 'Handle self assesment quiz' })
    @Post('/self-assesment')
    async handleSelfAssesmentEvent(@Body() body: any, @Headers('Typeform-Signature') signature, @Req() req: RawBodyRequest<Request>): Promise<TypeformEventResponseDto> {
        console.log(JSON.stringify(body));
        const response = this.typeformService.checkSignatureAndUserEmail(signature, req.rawBody, body, this.translator);
    
        if (typeof response !== 'string') {
            return response;
        }
        
        let user = await this.usersService.getOne([
            { method: ['byEmail', response] },
            { method: ['byRoles', UserRoles.user] },
            { method: ['withAdditionalField'] }
        ]);

        if (!user) {
            return new TypeformEventResponseDto(
                'USER_NOT_FOUND',
                this.translator.translate('USER_NOT_FOUND')
            );
        }

        await this.dbConnection.transaction(async transaction => {
            const userQuiz = await this.userQuizesService.create(
                {
                    userId: user.id,
                    quizType: TypeformQuizType.selfAssesment,
                    typeformFormId: TypeformHelper.getFormId(body),
                    submittedAt: TypeformHelper.getSubmittedAt(body),
                },
                transaction
            );

            const variables = TypeformHelper.getVariables(body);

            const answers = TypeformHelper.getAnswers(body);
            console.log(JSON.stringify(answers));
            const answersToCreate = answers.map(answer => Object.assign({ userId: user.id, quizId: userQuiz.id }, answer));

            await this.userQuizAnswersService.bulkCreate(answersToCreate, transaction);

            await this.typeformService.saveSelfAssesmentQuizParameters(variables, user, transaction);

            await this.decisionRulesService.updateUserRecommendations(user.id, body.form_response, transaction);
        });

        user = await this.usersService.getOne([
            { method: ['byId', user.id] },
            { method: ['withAdditionalField'] }
        ]);

        if (user.additionalField.shopifyCustomerId) {
            await this.shopifyService.updateCustomer(user.additionalField.shopifyCustomerId, user);
        }

        return new TypeformEventResponseDto(null, null);
    }
}
