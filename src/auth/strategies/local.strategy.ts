import { Strategy } from "passport-local";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { AuthService } from "../auth.service";
import { UserAuthDto } from "../dto/user-auth.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private authService: AuthService) {
    super({
      usernameField: "email",
    });
  }

  public async validate(email: string, password: string): Promise<UserAuthDto> {
    const user = await this.authService.validateByCredentials(email, password);

    if (!user) {
      throw new UnauthorizedException("Логин или пароль указаны неверно");
    }

    return user;
  }
}
