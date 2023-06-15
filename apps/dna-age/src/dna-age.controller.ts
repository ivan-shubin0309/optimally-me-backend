import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileTypes } from '../../common/src/resources/files/file-types';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { FilesService } from '../../files/src/files.service';
import { DnaAgeFilesService } from './dna-age-files.service';
import { PostDnaAgeDto } from './models/post-dna-age-file.dto';

@ApiBearerAuth()
@ApiTags('dna-age')
@Controller('dna-age')
export class DnaAgeController {
    constructor(
        private readonly dnaAgeFilesService: DnaAgeFilesService,
        private readonly filesService: FilesService,
    ) { }

    @ApiOperation({ summary: 'Process dna age file' })
    @HttpCode(HttpStatus.OK)
    @Roles(UserRoles.superAdmin)
    @Post('files')
    async processDnaAgeFile(@Body() body: PostDnaAgeDto): Promise<void> {
        const file = await this.filesService.checkCanUse(body.fileId, FileTypes.dnaAge, null, true);

        const data = await this.dnaAgeFilesService.parseCsvToJson(file);

        await this.dnaAgeFilesService.processDnaAgeResults(data);
    }
}
