import { TagEntity } from "src/models/tag.entity";
import { TagResponseDto } from "src/tag/dto/tag-response.dto";

export class AddTagForUserResponseDto {
  readonly tags: TagResponseDto[];

  constructor(tags: TagEntity[]) {
    this.tags = tags.map((tag) => new TagResponseDto(tag));
  }
}
