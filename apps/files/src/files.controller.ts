import {
  Post,
  Controller,
  Body,
  Request,
} from '@nestjs/common';

import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from 'apps/common/src/resources/users';
import { TranslatorService } from 'nestjs-translator';
import { FilesService } from './files.service';
import S3Service from './s3.service';

@ApiBearerAuth()
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly translator: TranslatorService,
    private readonly s3Service: S3Service
  ) { }

  @ApiCreatedResponse({ type: () => FilesAwsMetaDto })
  @ApiOperation({ summary: 'Request for save files.', description: ApiDescriptions.postFile })
  @Roles(UserRoles.superAdmin)
  @Post('')
  async prepareLoadUrls(@Body() body: PostFilesDto, @Request() req: any) {
    const filesRequests = this.filesService.prepareFiles(body, req.user);
    const promises = filesRequests.map(async file => {
      const awsResponse = await this.s3Service.createPresignedPost(file.key, file.contentType, file.acl);
      return Object.assign(awsResponse, file);
    });

    const awsResponses = await Promise.all(promises);

    const files = await this.filesService.createFilesInDb(req.user.userId, filesRequests);

    return new FilesAwsMetaDto(files, awsResponses);
  }
}
