import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { Request } from 'express';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('No Firebase ID token provided in request');
      throw new UnauthorizedException('No Firebase ID token provided');
    }

    try {
      this.logger.debug(`Verifying Firebase ID token: ${token.substring(0, 10)}...`);
      const decodedToken = await firebase.auth().verifyIdToken(token);
      // Add decoded token to request object
      request['user'] = decodedToken;
      this.logger.debug(`Authenticated user: ${decodedToken.uid}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Firebase token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid Firebase ID token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}