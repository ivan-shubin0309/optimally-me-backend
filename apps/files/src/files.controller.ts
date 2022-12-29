import {
  Post,
  Controller,
  Body,
  Request,
  Patch,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { TranslatorService } from 'nestjs-translator';
import { FilesService } from './files.service';
import { S3Service } from './s3.service';
import { FilesAwsMetaDto } from './models/files-aws-meta.dto';
import { ApiDescriptions } from '../../common/src/resources/files/api-descriptions';
import { FilesContentTypesDto } from './models/files-content-types.dto';
import { SessionDataDto } from '../../sessions/src/models';
import { PatchFilesDto } from './models/patch-files.dto';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { FilesDto } from './models/files.dto';

@ApiBearerAuth()
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly translator: TranslatorService,
    private readonly s3Service: S3Service,
  ) { }

  @ApiCreatedResponse({ type: () => FilesAwsMetaDto })
  @ApiOperation({ summary: 'Request for save files.', description: ApiDescriptions.postFile })
  @Roles(UserRoles.superAdmin, UserRoles.user)
  @Post('')
  async prepareLoadUrls(@Body() body: FilesContentTypesDto, @Request() req: Request & { user: SessionDataDto }): Promise<FilesAwsMetaDto> {
    const filesRequests = this.filesService.prepareFiles(body, req.user);
    const promises = filesRequests.map(async file => {
      const awsResponse = await this.s3Service.createPresignedPost(file.key, file.contentType, file.acl);
      return Object.assign(awsResponse, file);
    });

    const awsResponses = await Promise.all(promises);

    const files = await this.filesService.createFilesInDb(req.user.userId, filesRequests);

    return new FilesAwsMetaDto(files, awsResponses);
  }

  @ApiOperation({ summary: 'Patch file statuses to be loaded' })
  @ApiResponse({ type: () => FilesDto })
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.superAdmin, UserRoles.user)
  @Patch('')
  async patchFileStatuses(@Body() body: PatchFilesDto): Promise<FilesDto> {
    const scopes = [{ method: ['byId', body.fileIds] }];
    let files = await this.filesService.getList(scopes);

    if (files.length !== body.fileIds.length) {
      throw new NotFoundException({
        message: this.translator.translate('FILE_NOT_FOUND'),
        errorCode: 'FILE_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    await this.filesService.markFilesAsUploaded(files);

    files = await this.filesService.getList(scopes);

    return new FilesDto(files);
  }
}
