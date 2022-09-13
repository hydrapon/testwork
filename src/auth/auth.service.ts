import * as bcrypt from "bcrypt";
import { UserRepository } from "src/modules/user/db/user.repository";

import { Injectable } from "@nestjs/common";

import { JwtPayloadDto } from "./dto/jwt-payload.dto";
import { UserAuthDto } from "./dto/user-auth.dto";

@Injectable()
export class AuthService {
  constructor(private usersRepositort: UserRepository) {}

  async validateByPayload(payload: JwtPayloadDto): Promise<UserAuthDto | null> {
    const user = await this.usersRepositort.findByUId(payload.uid);

    if (!user) {
      return null;
    }

    return {
      uid: user.uid,
      email: user.email,
    };
  }

  async validateByCredentials(email: string, password: string): Promise<UserAuthDto | null> {
    const user = await this.usersRepositort.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return null;
    }

    return {
      uid: user.uid,
      email: user.email,
    };
  }
}
