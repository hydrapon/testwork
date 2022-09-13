import { UserAuthDto } from "src/auth/dto/user-auth.dto";
import { TagEntity } from "src/models/tag.entity";
import { UserEntity } from "src/models/user.entity";

import { NotFoundException, BadRequestException, Injectable } from "@nestjs/common";

import { TagRepository } from "./db/tag.repository";
import { CreateTagRequestDto } from "./dto/add-tag-request.dto";
import { FilterTagsResponseDto } from "./dto/filter-tag-response.dto";
import { FilterTagsRequestDto } from "./dto/filter-tags-request.dto";
import { MetagTagFilterDto } from "./dto/meta-tag-filter.dto";
import { TagResponseDto } from "./dto/tag-response.dto";
import { TagWithCreatorResponseDto } from "./dto/tag-with-creator-response.dto";
import { UpdateTagRequestDto } from "./dto/update-tag-request.dto";

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async createTag(createTagRequestDto: CreateTagRequestDto, user: UserAuthDto): Promise<TagResponseDto> {
    const checkTag = await this.tagRepository.findByName(createTagRequestDto.name);
    if (checkTag) {
      throw new BadRequestException("Тэг с таким именем уже существует");
    }

    const newTag = new TagEntity();
    const creatorUser = new UserEntity();
    creatorUser.uid = user.uid;
    newTag.creator = creatorUser;
    newTag.name = createTagRequestDto.name;
    if (createTagRequestDto.sortOrder) {
      newTag.sortOrder = createTagRequestDto.sortOrder;
    }

    return new TagResponseDto(await this.tagRepository.save(newTag));
  }

  async getTagById(id: number): Promise<TagWithCreatorResponseDto> {
    const tag = await this.tagRepository.findById(id);

    if (!tag) {
      throw new NotFoundException("Тэг с текущим id не найден");
    }
    return new TagWithCreatorResponseDto(tag);
  }

  async getTagsByFilters(filter: FilterTagsRequestDto): Promise<FilterTagsResponseDto> {
    const result = await this.tagRepository.findByFilter(filter);
    return new FilterTagsResponseDto(
      result.tags.map((tag) => new TagWithCreatorResponseDto(tag)),
      new MetagTagFilterDto(filter.page || 1, result.take, result.count),
    );
  }

  async updateTag(
    id: number,
    updateTagRequestDto: UpdateTagRequestDto,
    user: UserAuthDto,
  ): Promise<TagWithCreatorResponseDto> {
    const tag = await this.tagRepository.findById(id, user.uid);

    if (!tag) {
      throw new NotFoundException("Тэг не найден");
    }

    if (Object.keys(updateTagRequestDto).length == 0) {
      return new TagWithCreatorResponseDto(tag);
    }

    tag.name = updateTagRequestDto.name || tag.name;
    tag.sortOrder = updateTagRequestDto.sortOrder || tag.sortOrder;

    return new TagWithCreatorResponseDto(await this.tagRepository.save(tag));
  }

  async deleteTag(id: number, user: UserAuthDto): Promise<void> {
    const tag = await this.tagRepository.findById(id, user.uid);

    if (!tag) {
      throw new NotFoundException("Тэг не найден");
    }

    await this.tagRepository.delete(tag);
  }
}
