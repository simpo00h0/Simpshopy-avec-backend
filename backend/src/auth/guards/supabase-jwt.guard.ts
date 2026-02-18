import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

/**
 * Vérifie le JWT Supabase via JWKS (clés asymétriques ES256).
 * Utilise import() dynamique car jose est ESM-only (incompatible avec require).
 */
@Injectable()
export class SupabaseJwtGuard implements CanActivate {
  private jwksPromise: Promise<ReturnType<typeof import('jose').createRemoteJWKSet>> | null = null;

  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  private async getJwks() {
    if (!this.jwksPromise) {
      this.jwksPromise = (async () => {
        const { createRemoteJWKSet } = await import('jose');
        const url = this.config.get('SUPABASE_URL') || 'https://eeelvkkhnwbnhiybzwlm.supabase.co';
        const jwksUrl = `${url.replace(/\/$/, '')}/auth/v1/.well-known/jwks.json`;
        return createRemoteJWKSet(new URL(jwksUrl));
      })();
    }
    return this.jwksPromise;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token manquant');
    }

    const token = authHeader.slice(7);

    try {
      const { jwtVerify } = await import('jose');
      const jwks = await this.getJwks();
      const { payload } = await jwtVerify(token, jwks);

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
