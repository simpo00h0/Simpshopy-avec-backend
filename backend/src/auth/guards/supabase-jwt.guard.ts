import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { AuthService } from '../auth.service';

/**
 * Vérifie le JWT Supabase via JWKS (clés asymétriques ES256).
 * Utilisé quand Supabase a migré vers les JWT Signing Keys.
 */
@Injectable()
export class SupabaseJwtGuard implements CanActivate {
  private jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {
    const url = config.get('SUPABASE_URL') || 'https://eeelvkkhnwbnhiybzwlm.supabase.co';
    const jwksUrl = `${url.replace(/\/$/, '')}/auth/v1/.well-known/jwks.json`;
    this.jwks = createRemoteJWKSet(new URL(jwksUrl));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token manquant');
    }

    const token = authHeader.slice(7);

    try {
      const { payload } = await jwtVerify(token, this.jwks);

      const authUserId = payload.sub as string;
      const email = (payload.email as string) || '';
      const metadata = (payload.user_metadata as Record<string, unknown>) || {};
      const firstName = (metadata.firstName as string) || 'Utilisateur';
      const lastName = (metadata.lastName as string) || '';
      const phone = metadata.phone as string | undefined;
      const emailVerified = !!payload.email_confirmed_at;

      const user = await this.authService.findOrCreateFromSupabase({
        authUserId,
        email,
        firstName,
        lastName,
        phone,
        emailVerified,
      });

      if (!user || user.status === 'SUSPENDED') {
        throw new UnauthorizedException();
      }

      request.user = user;
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
