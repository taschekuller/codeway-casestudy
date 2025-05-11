import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { Request } from 'express';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No Firebase ID token provided');
    }

    try {
      const decodedToken = await firebase.auth().verifyIdToken(token);
      // Add decoded token to request object
      request['user'] = decodedToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase ID token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}