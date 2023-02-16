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
import { UserRoles } from 'apps/common/src/resources/users';

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
    ) { }

    @Public()
    @ApiOperation({ summary: 'Typeform webhook' })
    @Post('/push')
    async handleTypeformEvent(@Body() body: any, @Headers('Typeform-Signature') signature, @Req() req: RawBodyRequest<Request>): Promise<TypeformEventResponseDto> {
        console.log(JSON.stringify(body));

        const isVerified = this.typeformService.verifySignature(signature.split('sha256=')[1], req.rawBody);
        if (!isVerified) {
            throw new UnauthorizedException({
                message: this.translator.translate('TYPEFORM_EVENT_NOT_VERIFIED'),
                errorCode: 'TYPEFORM_EVENT_NOT_VERIFIED',
                statusCode: HttpStatus.UNAUTHORIZED
            });
        }

        const userEmail = TypeformHelper.getUserEmail(body);

        if (!userEmail) {
            return new TypeformEventResponseDto(
                'EMAIL_NOT_FOUND_ON_BODY',
                this.translator.translate('EMAIL_NOT_FOUND_ON_BODY')
            );
        }

        const user = await this.usersService.getOne([
            { method: ['byEmail', userEmail] },
            { method: ['byRoles', UserRoles.user] },
            { method: ['withAdditionalField'] }
        ]);

        if (!user) {
            return new TypeformEventResponseDto(
                'USER_NOT_FOUND',
                this.translator.translate('USER_NOT_FOUND')
            );
        }

        const quizType = TypeformHelper.getQuizType(body);
        if (!quizType) {
            return new TypeformEventResponseDto(
                'QUIZ_NOT_FOUND',
                this.translator.translate('QUIZ_NOT_FOUND', { replace: { quizName: TypeformHelper.getQuizName(body) } })
            );
        }

        await this.dbConnection.transaction(async transaction => {
            const userQuiz = await this.userQuizesService.create(
                {
                    userId: user.id,
                    quizType,
                    typeformFormId: TypeformHelper.getFormId(body)
                },
                transaction
            );

            const answers = TypeformHelper.getAnswers(body);
            console.log(JSON.stringify(answers));
            const answersToCreate = answers.map(answer => Object.assign({ userId: user.id, quizId: userQuiz.id }, answer));

            await this.userQuizAnswersService.bulkCreate(answersToCreate, transaction);

            await this.typeformService.saveParametersFromQuiz(answers, user, transaction);
        });

        return new TypeformEventResponseDto(null, null);
    }
}