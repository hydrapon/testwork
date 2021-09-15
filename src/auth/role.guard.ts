import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        try {
            const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ])

            if (!requiredRoles) {
                return true;
            }

            const authHeader = req.headers.authorization;
            const authHeaderArray = authHeader.split(' ');
            const bearer = authHeaderArray[0];
            const token = authHeaderArray[1];

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'user is not login' })
            }

            const user = this.jwtService.verify(token)
            req.user = user;
            return user.role >= requiredRoles;

        } catch (e) {
            throw new UnauthorizedException({ message: 'user is not login' })
        }
    }
}