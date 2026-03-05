import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { SupabaseJwtGuard } from '../../auth/guards/supabase-jwt.guard';
import { MediaService } from '../media.service';
import { FindFirstStoreByOwnerUseCase } from '../../stores/application/find-first-store-by-owner.usecase';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon',
];

@ApiTags('media')
@Controller('media')
@UseGuards(SupabaseJwtGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(
    private mediaService: MediaService,
    private findFirstStoreByOwnerUseCase: FindFirstStoreByOwnerUseCase,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload une image et l’ajouter à la bibliothèque' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        altText: { type: 'string' },
      },
    },
  })
  async upload(
    @Request() req: { user: { id: string } },
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: MAX_SIZE })],
      }),
    )
    file: Express.Multer.File,
    @Query('altText') altText?: string,
  ) {
    if (!file || !ALLOWED_MIMES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Type de fichier non autorisé. Utilisez JPEG, PNG, GIF, WebP, SVG ou ICO.',
      );
    }
    const store = await this.findFirstStoreByOwnerUseCase.execute(req.user.id);
    const alt = typeof altText === 'string' ? altText : undefined;
    return this.mediaService.upload(store.id, file, alt);
  }

  @Get()
  @ApiOperation({ summary: 'Liste des médias de la boutique (bibliothèque)' })
  async findAll(
    @Request() req: { user: { id: string } },
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const store = await this.findFirstStoreByOwnerUseCase.execute(req.user.id);
    const limitNum = limit ? parseInt(limit, 10) : 50;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    return this.mediaService.findByStore(store.id, limitNum, offsetNum);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un média de la bibliothèque' })
  async delete(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    const store = await this.findFirstStoreByOwnerUseCase.execute(req.user.id);
    await this.mediaService.delete(id, store.id);
    return { success: true };
  }
}
