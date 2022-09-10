import { Response as Res } from "express";

import { Body, Controller, HttpStatus, Post, Request, UseGuards, Response } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AppService } from "./app.service";
import { TokenReponseDto } from "./auth/dto/token.dto";
import { UserCredentialsDto } from "./auth/dto/user-credentials.dto";
import { IUserAuthRequest } from "./auth/interfaces/user-auth-request.interface";
import { ExceptionDto } from "./common/dto/exception.dto";
import { CreateUserRequestDto } from "./user/dto/create-user-request.dto";

@ApiTags("App")
@Controller("")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: "Регистрация пользователя" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ExceptionDto })
  @Post("signin")
  async signin(@Body() createUserRequestDto: CreateUserRequestDto): Promise<TokenReponseDto> {
    return await this.appService.signin(createUserRequestDto);
  }

  @ApiOperation({ summary: "Авторизация пользователя" })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ExceptionDto })
  @ApiBody({ type: UserCredentialsDto })
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Request() req: IUserAuthRequest): Promise<TokenReponseDto> {
    return this.appService.login(req.user);
  }

  @ApiOperation({ summary: "Обновление токенов" })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ExceptionDto })
  @ApiBearerAuth("access-token")
  @UseGuards(AuthGuard("jwt-refresh"))
  @Post("refresh")
  async refresh(@Request() req: IUserAuthRequest): Promise<TokenReponseDto> {
    return this.appService.refresh(req.user);
  }

  @ApiOperation({ summary: "Завершение сессии" })
  @UseGuards(AuthGuard("jwt"))
  @Post("logout")
  async logout(@Response() res: Res) {
    res.status(HttpStatus.OK).send();
  }
}
