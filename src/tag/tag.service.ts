import { UserAuthDto } from "src/auth/dto/user-auth.dto";
import { FilterTag } from "src/common/enums/filter-tag.enum";
import { TagEntity } from "src/models/tag.entity";
import { UserEntity } from "src/models/user.entity";
import { In, Repository } from "typeorm";

import { NotFoundException, BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateTagRequestDto } from "./dto/add-tag-request.dto";
import { FilterTagsResponseDto } from "./dto/filter-tag-response.dto";
import { FilterTagsRequestDto } from "./dto/filter-tags-request.dto";
import { MetagTagFilterDto } from "./dto/meta-tag-filter.dto";
import { TagResponseDto } from "./dto/tag-response.dto";
import { TagWithCreatorResponseDto } from "./dto/tag-with-creator-response.dto";
import { UpdateTagRequestDto } from "./dto/update-tag-request.dto";

@Injectable()
export class TagService {
  private _OFFSET: number = 10;

  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) {}

  async createTag(createTagRequestDto: CreateTagRequestDto, user: UserAuthDto): Promise<TagResponseDto> {
    const checkTag = await this.findByName(createTagRequestDto.name);
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
    const tag = await this.findById(id);

    if (!tag) {
      throw new NotFoundException("Тэг с текущим id не найден");
    }
    return new TagWithCreatorResponseDto(tag);
  }

  async getTagsByFilters(filter: FilterTagsRequestDto): Promise<FilterTagsResponseDto> {
    const take = filter.pageSize || this._OFFSET;
    const query = this.tagRepository.createQueryBuilder("t").leftJoinAndSelect("t.creator", "c");

    if (Object.keys(filter).includes(FilterTag.ByName)) {
      query.orderBy(`t.${FilterTag.ByName}`);
    }
    if (Object.keys(filter).includes(FilterTag.ByOrder)) {
      query.orderBy(`t.${FilterTag.ByOrder}`);
    }
    const count = await query.getCount();

    if (filter.page) {
      const offest = (filter.page - 1) * take;
      query.offset(offest);
    }

    const result = await query.limit(take).getMany();
    return new FilterTagsResponseDto(
      result.map((tag) => new TagWithCreatorResponseDto(tag)),
      new MetagTagFilterDto(filter.page || 1, take, count),
    );
  }

  async updateTag(
    id: number,
    updateTagRequestDto: UpdateTagRequestDto,
    user: UserAuthDto,
  ): Promise<TagWithCreatorResponseDto> {
    const tag = await this.findById(id, user.uid);

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
    const tag = await this.findById(id, user.uid);

    if (!tag) {
      throw new NotFoundException("Тэг не найден");
    }

    await this.tagRepository.delete(tag);
  }

  async findByName(name: string): Promise<TagEntity | undefined> {
    return await this.tagRepository.findOne({ name });
  }

  async findById(id: number, creator_id?: string, withCreator: boolean = true): Promise<TagEntity | undefined> {
    const query = this.tagRepository.createQueryBuilder("t").where("t.id = :id", { id });

    if (withCreator) {
      query.leftJoinAndSelect("t.creator", "c");
    }

    if (creator_id) {
      query.andWhere("t.creator = :creator_id", { creator_id });
    }
    return await query.getOne();
  }

  async findByArrayIds(ids: number[]): Promise<TagEntity[]> {
    return await this.tagRepository.find({ where: { id: In(ids) } });
  }
}
