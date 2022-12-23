import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileTypes } from '../../common/src/resources/files/file-types';
import { FilesService } from '../../files/src/files.service';
import { SessionDataDto } from '../../sessions/src/models';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { ItemImageAuxOutListDto } from './models/item-image-aux-out-list.dto';
import { PostImageToHautAiDto } from './models/post-image-to-haut-ai.dto';
import { UserHautAiFieldsService } from './user-haut-ai-fields.service';
import { UsersService } from '../../users/src/users.service';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { SubjectInDto } from './models/subject-in.dto';
import { HautAiHelper } from '../../common/src/resources/haut-ai/haut-ai.helper';
import { SexTypes } from '../../common/src/resources/filters/sex-types';

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

    @ApiCreatedResponse({ type: () => Object })
    @ApiOperation({ summary: 'Upload image for face app processing' })
    @Roles(UserRoles.user)
    @Post('/face-skin-metrics/images')
    async uploadImageToFaceApp(@Body() body: PostImageToHautAiDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
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

        const hautAiUser: { accessToken: string, userId: number } = await this.userHautAiFieldsService.getHautAiAccessToken();

        if (!user.hautAiField.hautAiSubjectId) {
            const subjectData: SubjectInDto = {
                name: HautAiHelper.generateSubjectName(user),
                birth_date: user.additionalField.dateOfBirth,
                biological_sex: SexTypes[user.additionalField.sex],
            };
            const subjectId = await this.userHautAiFieldsService.createSubject(user.id, hautAiUser.accessToken, subjectData);

            user.hautAiField.setDataValue('hautAiSubjectId', subjectId);
            user.hautAiField.hautAiSubjectId = subjectId;
        }

        return this.userHautAiFieldsService.uploadPhotoToHautAi(file, user.hautAiField.hautAiSubjectId, hautAiUser);
    }
}
