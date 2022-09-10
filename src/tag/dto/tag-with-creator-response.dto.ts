import { TagEntity } from "src/models/tag.entity";
import { UserCreatorDto } from "src/user/dto/user-creator.dto";

export class TagWithCreatorResponseDto {
  readonly creator: UserCreatorDto;
  readonly name: string;
  readonly sortOrder: number;

  constructor(tag: TagEntity) {
    this.name = tag.name;
    this.sortOrder = tag.sortOrder;
    this.creator = new UserCreatorDto(tag.creator);
  }
}
