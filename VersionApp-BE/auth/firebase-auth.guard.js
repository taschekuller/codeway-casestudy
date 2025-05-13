"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FirebaseAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const firebase = require("firebase-admin");
let FirebaseAuthGuard = FirebaseAuthGuard_1 = class FirebaseAuthGuard {
    logger = new common_1.Logger(FirebaseAuthGuard_1.name);
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            this.logger.warn('No Firebase ID token provided in request');
            throw new common_1.UnauthorizedException('No Firebase ID token provided');
        }
        try {
            this.logger.debug(`Verifying Firebase ID token: ${token.substring(0, 10)}...`);
            const decodedToken = await firebase.auth().verifyIdToken(token);
            request['user'] = decodedToken;
            this.logger.debug(`Authenticated user: ${decodedToken.uid}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Firebase token verification failed: ${error.message}`);
            throw new common_1.UnauthorizedException('Invalid Firebase ID token');
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.FirebaseAuthGuard = FirebaseAuthGuard;
exports.FirebaseAuthGuard = FirebaseAuthGuard = FirebaseAuthGuard_1 = __decorate([
    (0, common_1.Injectable)()
], FirebaseAuthGuard);
//# sourceMappingURL=firebase-auth.guard.js.map