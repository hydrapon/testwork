import { FilterTag } from "src/common/enums/filter-tag.enum";
import { DeleteResult, In, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TagEntity } from "../../../models/tag.entity";
import { FilterRepositoryResponse } from "../dto/filter-repository-response";
import { FilterTagsRequestDto } from "../dto/filter-tags-request.dto";

@Injectable()
export class TagRepository {
  private readonly _DEFAULT_OFFSET = 10;
  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) {}

  async save(tag: TagEntity): Promise<TagEntity> {
    return await this.tagRepository.save(tag);
  }

  async findByFilter(filter: FilterTagsRequestDto, withCount: boolean = true): Promise<FilterRepositoryResponse> {
    const take = filter.pageSize || this._DEFAULT_OFFSET;
    let count: number | null = null;
    const query = this.tagRepository.createQueryBuilder("t").leftJoinAndSelect("t.creator", "c");

    if (Object.keys(filter).includes(FilterTag.ByName)) {
      query.orderBy(`t.name`);
    }
    if (Object.keys(filter).includes(FilterTag.ByOrder)) {
      query.orderBy(`t.sortOrder`);
    }

    if (withCount) {
      count = await query.getCount();
    }

    if (filter.page) {
      const offest = (filter.page - 1) * take;
      query.offset(offest);
    }

    const tags = await query.limit(take).getMany();
    return {
      tags,
      count,
      take,
    };
  }

  async delete(tag: TagEntity): Promise<DeleteResult> {
    return await this.tagRepository.delete(tag);
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
