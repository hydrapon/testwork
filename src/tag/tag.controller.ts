import { Response as Res } from "express";
import { IUserAuthRequest } from "src/auth/interfaces/user-auth-request.interface";
import { ExceptionDto } from "src/common/dto/exception.dto";

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  Query,
  Put,
  Delete,
  HttpStatus,
  Response,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CreateTagRequestDto } from "./dto/add-tag-request.dto";
import { FilterTagsResponseDto } from "./dto/filter-tag-response.dto";
import { FilterTagsRequestDto } from "./dto/filter-tags-request.dto";
import { TagResponseDto } from "./dto/tag-response.dto";
import { TagWithCreatorResponseDto } from "./dto/tag-with-creator-response.dto";
import { UpdateTagRequestDto } from "./dto/update-tag-request.dto";
import { TagService } from "./tag.service";

@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth("access-token")
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ExceptionDto })
@ApiTags("Тэги")
@Controller("tag")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: "Добавление тэга" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ExceptionDto })
  @Post()
  createTag(@Body() createTagRequestDto: CreateTagRequestDto, @Req() req: IUserAuthRequest): Promise<TagResponseDto> {
    return this.tagService.createTag(createTagRequestDto, req.user);
  }

  @ApiOperation({ summary: "Добавление тэгов по фильтру" })
  @Get()
  getTagsByFilters(@Query() filter: FilterTagsRequestDto): Promise<FilterTagsResponseDto> {
    return this.tagService.getTagsByFilters(filter);
  }

  @ApiOperation({ summary: "Добавление тэгов по ID" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ExceptionDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ExceptionDto })
  @Get("/:id")
  getTagById(@Param("id", ParseIntPipe) id: number): Promise<TagWithCreatorResponseDto> {
    return this.tagService.getTagById(id);
  }

  @ApiOperation({ summary: "Редактирование тэга" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ExceptionDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ExceptionDto })
  @Put("/:id")
  updateTag(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTagRequestDto: UpdateTagRequestDto,
    @Req() req: IUserAuthRequest,
  ) {
    return this.tagService.updateTag(id, updateTagRequestDto, req.user);
  }

  @ApiOperation({ summary: "Удаление тэга" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ExceptionDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ExceptionDto })
  @Delete("/:id")
  async deleteTag(@Param("id", ParseIntPipe) id: number, @Req() req: IUserAuthRequest, @Response() res: Res) {
    await this.tagService.deleteTag(id, req.user);
    res.status(HttpStatus.CREATED).send();
  }
}
