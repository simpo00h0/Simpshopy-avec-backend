import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseJwtGuard } from '../guards/supabase-jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(SupabaseJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Obtenir le profil de l'utilisateur connecté (token Supabase)",
  })
  async getProfile(@Request() req: { user: unknown }) {
    return req.user;
  }
}
