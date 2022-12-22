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

@ApiBearerAuth()
@ApiTags('haut-ai')
@Controller('haut-ai')
export class HautAiController {
    constructor(
        private readonly userHautAiFieldsService: UserHautAiFieldsService,
        private readonly filesService: FilesService,
    ) { }

    @ApiCreatedResponse({ type: () => ItemImageAuxOutListDto })
    @ApiOperation({ summary: 'Upload image for face app processing' })
    @Roles(UserRoles.user)
    @Post('/face-skin-metrics/images')
    async uploadImageToFaceApp(@Body() body: PostImageToHautAiDto, @Request() req: Request & { user: SessionDataDto }): Promise<ItemImageAuxOutListDto> {
        const file = await this.filesService.checkCanUse(body.fileId, FileTypes.mirrorMirror, null, true);


    }
}
