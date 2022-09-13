import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { JwtPayloadDto } from "./auth/dto/jwt-payload.dto";
import { TokenReponseDto } from "./auth/dto/token.dto";
import { UserAuthDto } from "./auth/dto/user-auth.dto";
import { UserRepository } from "./modules/user/db/user.repository";
import { CreateUserRequestDto } from "./modules/user/dto/create-user-request.dto";

@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService, private readonly userRepository: UserRepository) {}

  async signin(createUserRequestDto: CreateUserRequestDto): Promise<TokenReponseDto> {
    const newUserEntity = await CreateUserRequestDto.MapToEntity(createUserRequestDto);
    const checkEmailUser = await this.userRepository.findByEmail(createUserRequestDto.email);
    if (checkEmailUser) {
      throw new BadRequestException("Пользователь с таким Email уже существует");
    }
    const checkNicknameUser = await this.userRepository.findByNickname(createUserRequestDto.nickname);
    if (checkNicknameUser) {
      throw new BadRequestException("Пользователь с таким Nickname уже существует");
    }
    const newUser = await this.userRepository.save(newUserEntity);
    return this.generateTokens(new UserAuthDto(newUser.uid, newUser.email));
  }

  async login(authUser: UserAuthDto): Promise<TokenReponseDto> {
    return this.generateTokens(authUser);
  }

  async refresh(authUser: UserAuthDto): Promise<TokenReponseDto> {
    return this.generateTokens(authUser);
  }

  async logout() {
    const tokenResponse = new TokenReponseDto(this.jwtService.sign({}, { expiresIn: `0m` }));
    return tokenResponse;
  }

  private generateTokens(userAuth: UserAuthDto): TokenReponseDto {
    const payload: JwtPayloadDto = {
      uid: userAuth.uid,
    };
    const tokenResponse = new TokenReponseDto(
      this.jwtService.sign(payload, { expiresIn: `${Number(process.env["ACCESS_TOKEN_TTL"]) * 60}m` ?? "30h" }),
    );

    return tokenResponse;
  }
}
