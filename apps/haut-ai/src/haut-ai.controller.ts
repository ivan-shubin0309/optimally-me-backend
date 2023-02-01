import { BadRequestException, Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query, Request, UnprocessableEntityException } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileTypes } from '../../common/src/resources/files/file-types';
import { FilesService } from '../../files/src/files.service';
import { SessionDataDto } from '../../sessions/src/models';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { PostImageToHautAiDto } from './models/post-image-to-haut-ai.dto';
import { UserHautAiFieldsService } from './user-haut-ai-fields.service';
import { UsersService } from '../../users/src/users.service';
import { SubjectInDto } from './models/subject-in.dto';
import { HautAiHelper } from '../../common/src/resources/haut-ai/haut-ai.helper';
import { SexTypes } from '../../common/src/resources/filters/sex-types';
import { HautAiUploadedPhotoDto } from './models/haut-ai-uploaded-photo.dto';
import { EntityByIdDto } from '../../common/src/models/entity-by-id.dto';
import { SkinUserResultsService } from './skin-user-results.service';
import { DateTime } from 'luxon';
import { MAX_IMAGE_UPLOAD_COUNT, MAX_IMAGE_UPLOAD_DAYS_INTERVAL } from '../../common/src/resources/haut-ai/constants';
import { TranslatorService } from 'nestjs-translator';
import { HautAiGetResultsDto } from './models/haut-ai-get-results.dto';
import { SkinUserResultStatuses } from '../../common/src/resources/haut-ai/skin-user-result-statuses';
import { GetSkinResultListDto } from './models/get-skin-result-list.dto';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { SkinResultListDto } from './models/skin-result-list.dto';
import { UsersResultsService } from '../../users-results/src/users-results.service';
import { UserResultsDto } from '../../admins-results/src/models/user-results.dto';
import { GetResultsBySkinResultDto } from './models/get-results-by-skin-result.dto';
import { hautAiResultOrderScope } from '../../common/src/resources/haut-ai/result-order-types';

@ApiBearerAuth()
@ApiTags('haut-ai')
@Controller('haut-ai')
export class HautAiController {
    constructor(
        private readonly userHautAiFieldsService: UserHautAiFieldsService,
        private readonly filesService: FilesService,
        private readonly usersSevice: UsersService,
        private readonly skinUserResultsService: SkinUserResultsService,
        private readonly translator: TranslatorService,
        private readonly usersResultsService: UsersResultsService,
    ) { }

    @ApiCreatedResponse({ type: () => HautAiUploadedPhotoDto })
    @ApiOperation({ summary: 'Upload image for face app processing' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.CREATED)
    @Post('/face-skin-metrics/images')
    async uploadImageToFaceApp(@Body() body: PostImageToHautAiDto, @Request() req: Request & { user: SessionDataDto }): Promise<HautAiUploadedPhotoDto> {
        const file = await this.filesService.checkCanUse(body.fileId, FileTypes.mirrorMirror, null, true);

        const user = await this.usersSevice.getOne([
            { method: ['byId', req.user.userId] },
            { method: ['byRoles', UserRoles.user] },
            'withHautAiField',
            'withAdditionalField'
        ]);

        if (!user?.additionalField?.skinType && !body.skinType) {
            throw new BadRequestException({
                message: this.translator.translate('SKIN_TYPE_IS_EMPTY'),
                errorCode: 'SKIN_TYPE_IS_EMPTY',
                statusCode: HttpStatus.FORBIDDEN
            });
        }

        if (!user?.additionalField?.skinType && body.skinType) {
            await user.additionalField.update({ skinType: body.skinType });
        }

        if (!user.hautAiField) {
            const hautAiField = await this.userHautAiFieldsService.create(user.id);

            user.setDataValue('hautAiField', hautAiField);
            user.hautAiField = hautAiField;
        }

        const imagesUploadedCount = await this.skinUserResultsService.getCount([
            { method: ['byUserHautAiFieldId', user.hautAiField.id] },
            { method: ['afterDate', DateTime.utc().minus({ day: MAX_IMAGE_UPLOAD_DAYS_INTERVAL })] }
        ]);

        if (imagesUploadedCount >= MAX_IMAGE_UPLOAD_COUNT) {
            throw new ForbiddenException({
                message: this.translator.translate('HAUT_AI_IMAGE_UPLOAD_LIMIT'),
                errorCode: 'HAUT_AI_IMAGE_UPLOAD_LIMIT',
                statusCode: HttpStatus.FORBIDDEN
            });
        }

        const accessToken = this.userHautAiFieldsService.getAccessToken();
        console.log('Get access token');

        if (!user.hautAiField.hautAiSubjectId) {
            console.log('Creating subject');
            const subjectData: SubjectInDto = {
                name: HautAiHelper.generateSubjectName(user),
                birth_date: user.additionalField.dateOfBirth,
                biological_sex: SexTypes[user.additionalField.sex],
            };
            const subjectId = await this.userHautAiFieldsService.createSubject(user.id, accessToken, subjectData);

            user.hautAiField.setDataValue('hautAiSubjectId', subjectId);
            user.hautAiField.hautAiSubjectId = subjectId;
            console.log('Subject created');
        }

        console.log('Start to upload photo');
        const result = await this.userHautAiFieldsService.uploadPhotoToHautAi(file, user.hautAiField.hautAiSubjectId, accessToken);
        console.log('Photo uploaded');

        await this.filesService.markFilesAsUsed([file.id]);

        const skinResult = await this.skinUserResultsService.create({
            hautAiBatchId: result.batchId,
            hautAiFileId: result.uploadedFileId,
            userHautAiFieldId: user.hautAiField.id,
            fileId: body.fileId
        });

        result.skinResultId = skinResult.id;

        return result;
    }

    @ApiResponse({ type: () => Object })
    @ApiOperation({ summary: 'Get results for uploaded image' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Post('/face-skin-metrics/results')
    async getImageResults(@Body() body: HautAiGetResultsDto): Promise<any> {
        return this.userHautAiFieldsService.getImageResults(this.userHautAiFieldsService.getAccessToken(), body.subjectId, body.batchId, body.uploadedFileId);
    }

    @ApiOperation({ summary: 'Load skin results' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Patch('/face-skin-metrics/skin-results/:id')
    async loadSkinResults(@Param() params: EntityByIdDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
        const user = await this.usersSevice.getOne([
            { method: ['byId', req.user.userId] },
            { method: ['byRoles', UserRoles.user] },
            'withHautAiField',
            'withAdditionalField'
        ]);

        if (!user.hautAiField || !user.hautAiField?.hautAiSubjectId) {
            throw new NotFoundException({
                message: this.translator.translate('SKIN_RESULT_NOT_FOUND'),
                errorCode: 'SKIN_RESULT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        const skinResult = await this.skinUserResultsService.getOne([
            { method: ['byUserHautAiFieldId', user.hautAiField.id] },
            { method: ['byId', params.id] }
        ]);

        if (!skinResult) {
            throw new NotFoundException({
                message: this.translator.translate('SKIN_RESULT_NOT_FOUND'),
                errorCode: 'SKIN_RESULT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        if (skinResult.status === SkinUserResultStatuses.loaded) {
            throw new BadRequestException({
                message: this.translator.translate('SKIN_RESULT_ALREADY_LOADED'),
                errorCode: 'SKIN_RESULT_ALREADY_LOADED',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        const results = await this.userHautAiFieldsService.getImageResults(
            this.userHautAiFieldsService.getAccessToken(),
            user.hautAiField.hautAiSubjectId,
            skinResult.hautAiBatchId,
            skinResult.hautAiFileId
        );

        if (!results || !results?.length) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('SKIN_RESULT_NOT_LOADED'),
                errorCode: 'SKIN_RESULT_NOT_LOADED',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        await this.skinUserResultsService.saveResults(results, skinResult, req.user.userId);
    }

    @ApiOperation({ summary: 'Get skin result dates' })
    @ApiResponse({ type: () => SkinResultListDto })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Get('/face-skin-metrics/skin-results')
    async getSkinResultDates(@Request() req: Request & { user: SessionDataDto }, @Query() query: GetSkinResultListDto): Promise<SkinResultListDto> {
        let skinResults = [], count = 0;

        const scopes: any[] = [];

        const user = await this.usersSevice.getOne([
            { method: ['byId', req.user.userId] },
            { method: ['byRoles', UserRoles.user] },
            'withHautAiField'
        ]);

        if (!user.hautAiField || !user.hautAiField?.hautAiSubjectId) {
            return;
        }

        scopes.push({ method: ['byUserHautAiFieldId', user.hautAiField.id] });

        count = await this.skinUserResultsService.getCount(scopes);

        if (count) {
            scopes.push(
                { method: ['pagination', { limit: query.limit, offset: query.offset }] },
                { method: ['orderBy', [['createdAt', 'desc']]] }
            );

            skinResults = await this.skinUserResultsService.getList(scopes);
        }

        return new SkinResultListDto(skinResults, PaginationHelper.buildPagination({ limit: query.limit, offset: query.offset }, count));
    }

    @ApiOperation({ summary: 'Get results by skin result id' })
    @ApiResponse({ type: () => UserResultsDto })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Get('/face-skin-metrics/skin-results/:id/results')
    async getResultsBySkinResultId(@Param() param: EntityByIdDto, @Query() query: GetResultsBySkinResultDto, @Request() req: Request & { user: SessionDataDto }): Promise<UserResultsDto> {
        const { limit, offset } = query;

        let userResultsList = [];
        const scopes: any[] = [
            { method: ['bySkinUserResultId', param.id] },
            { method: ['byUserId', req.user.userId] }
        ];

        const count = await this.usersResultsService.getCount(scopes);

        if (count) {
            scopes.push(
                { method: ['pagination', { limit, offset }] },
                'withUnit',
                'withBiomarker',
                hautAiResultOrderScope[query.orderBy](query),
            );
            userResultsList = await this.usersResultsService.getList(scopes);
        }

        return new UserResultsDto(userResultsList, PaginationHelper.buildPagination({ limit, offset }, count));
    }
}
