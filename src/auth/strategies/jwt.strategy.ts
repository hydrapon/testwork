import { ExtractJwt, Strategy } from "passport-jwt";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { AuthService } from "../auth.service";
import { JwtPayloadDto } from "../dto/jwt-payload.dto";
import { UserAuthDto } from "../dto/user-auth.dto";
import { jwtOptions } from "../options/auth.options";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtOptions.secret,
    });
  }

  public async validate(payload: JwtPayloadDto): Promise<UserAuthDto> {
    const user = await this.authService.validateByPayload(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      uid: user.uid,
      email: user.email,
    };
  }
}
