import { Controller, Get, UseGuards, Request, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseJwtGuard } from '../../auth/guards/supabase-jwt.guard';
import { UsersService } from '../users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(SupabaseJwtGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtenir mon profil' })
  getProfile(@Request() req: { user: { id: string } }) {
    return this.usersService.findOne(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Mettre à jour mon profil' })
  updateProfile(
    @Request() req: { user: { id: string } },
    @Body() updateData: { firstName?: string; lastName?: string; phone?: string; avatar?: string },
  ) {
    return this.usersService.update(req.user.id, updateData);
  }
}
