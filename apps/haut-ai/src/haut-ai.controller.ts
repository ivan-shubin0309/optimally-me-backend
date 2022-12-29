import { Body, Controller, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileTypes } from '../../common/src/resources/files/file-types';
import { FilesService } from '../../files/src/files.service';
import { SessionDataDto } from '../../sessions/src/models';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { PostImageToHautAiDto } from './models/post-image-to-haut-ai.dto';
import { UserHautAiFieldsService } from './user-haut-ai-fields.service';
import { UsersService } from '../../users/src/users.service';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { SubjectInDto } from './models/subject-in.dto';
import { HautAiHelper } from '../../common/src/resources/haut-ai/haut-ai.helper';
import { SexTypes } from '../../common/src/resources/filters/sex-types';
import { HautAiUploadedPhotoDto } from './models/haut-ai-uploaded-photo.dto';

@ApiBearerAuth()
@ApiTags('haut-ai')
@Controller('haut-ai')
export class HautAiController {
    constructor(
        private readonly userHautAiFieldsService: UserHautAiFieldsService,
        private readonly filesService: FilesService,
        private readonly usersSevice: UsersService,
        private readonly configService: ConfigService,
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

        if (!user.hautAiField) {
            const hautAiField = await this.userHautAiFieldsService.create(user.id);

            user.setDataValue('hautAiField', hautAiField);
            user.hautAiField = hautAiField;
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

        return result;
    }

    @ApiResponse({ type: () => Object })
    @ApiOperation({ summary: 'Get results for uploaded image' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Post('/face-skin-metrics/results')
    async getImageResults(@Body() body: HautAiUploadedPhotoDto): Promise<any> {
        return this.userHautAiFieldsService.getImageResults(this.userHautAiFieldsService.getAccessToken(), body.subjectId, body.batchId, body.uploadedFileId);
    }
}
