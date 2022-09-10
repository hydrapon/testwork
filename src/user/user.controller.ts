import { Response as Res } from "express";
import { IUserAuthRequest } from "src/auth/interfaces/user-auth-request.interface";
import { ExceptionDto } from "src/common/dto/exception.dto";

import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UseGuards,
  Response,
  HttpStatus,
  Post,
  ParseIntPipe,
  Param,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AddTagForUserRequestDto } from "./dto/add-tag-for-user-request.dto";
import { AddTagForUserResponseDto } from "./dto/add-tag-for-user-response.dto";
import { GetUserResponseDto } from "./dto/get-user-response.dto";
import { UpdateUserRequestDto } from "./dto/update-user-request.dto";
import { UpdateUserResponseDto } from "./dto/update-user-response.dto";
import { UserService } from "./user.service";

@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth("access-token")
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ExceptionDto })
@ApiTags("Рользователи")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "Получение пользователя" })
  @Get()
  getUser(@Req() req: IUserAuthRequest): Promise<GetUserResponseDto> {
    return this.userService.getUserWithTag(req.user);
  }

  @ApiOperation({ summary: "Редактирование пользователя" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ExceptionDto })
  @Put()
  updateUser(
    @Body() updateUserRequestDto: UpdateUserRequestDto,
    @Req() req: IUserAuthRequest,
  ): Promise<UpdateUserResponseDto> {
    return this.userService.updateUser(updateUserRequestDto, req.user);
  }

  @ApiOperation({ summary: "Удаление пользователя" })
  @Delete()
  async deleteUser(@Response() res: Res, @Req() req: IUserAuthRequest): Promise<void> {
    await this.userService.deleteUser(req.user);
    res.status(HttpStatus.CREATED).send();
  }

  @ApiOperation({ summary: "Добавление тэгов пользователю" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ExceptionDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ExceptionDto })
  @Post("/tag")
  addTagsForUser(
    @Body() addTagForUserRequestDto: AddTagForUserRequestDto,
    @Req() req: IUserAuthRequest,
  ): Promise<AddTagForUserResponseDto> {
    return this.userService.addTagsForUser(addTagForUserRequestDto, req.user);
  }

  @ApiOperation({ summary: "Удаление добавленного тэга" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ExceptionDto })
  @Delete("/tag/:id")
  deleteUserTag(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: IUserAuthRequest,
  ): Promise<AddTagForUserResponseDto> {
    return this.userService.deleteUserTag(id, req.user);
  }

  @ApiOperation({ summary: "Получение тэгов созданных пользователем" })
  @Get("tag/my")
  getUserTags(@Req() req: IUserAuthRequest): Promise<AddTagForUserResponseDto> {
    return this.userService.getUserTags(req.user);
  }
}
