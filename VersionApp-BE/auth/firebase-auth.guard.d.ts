import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class FirebaseAuthGuard implements CanActivate {
    private readonly logger;
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
