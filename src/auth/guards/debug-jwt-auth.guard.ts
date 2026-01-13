import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class DebugJwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(DebugJwtAuthGuard.name);

  cantActive(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    this.logger.log('=== DEBUG JWT AUTH GUARD ===');
    this.logger.log(`Request URL: ${request.url}`);
    this.logger.log(`Authorization Header: ${authHeader}`);

    if (!authHeader) {
      this.logger.error('No Authorization header found');
      return false;
    }
  }

  headleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    this.logger.log('=== HANDLE REQUEST ===');

    if (err) {
      this.logger.error(`JWT Error: ${err.message}`);
      throw err;
    }

    if (info) {
      this.logger.warn(`JWT Info: ${info.message}`);
    }

    if (!user) {
      this.logger.error('No user extracted from JWT');
      throw new Error('Unauthorized');
    }

    this.logger.log(`User authenticated: ${user.username}`);
    return user;
  }
}
