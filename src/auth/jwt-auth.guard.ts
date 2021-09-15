import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const authHeader = req.headers.authorization;
            const authHeaderArray = authHeader.split(' ');
            const bearer = authHeaderArray[0];
            const token = authHeaderArray[1];

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'user is not login' })
            }

            const user = this.jwtService.verify(token)
            req.user = user;
            return true;

        } catch (e) {
            console.log(e)
            throw new UnauthorizedException({ message: 'user is not login' })
        }
    }
}