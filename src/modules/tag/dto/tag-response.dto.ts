import { TagEntity } from "src/models/tag.entity";

export class TagResponseDto {
  readonly id: number;
  readonly name: string;
  readonly sortOrder: number;

  constructor(tag: TagEntity) {
    this.id = tag.id;
    this.name = tag.name;
    this.sortOrder = tag.sortOrder;
  }
}
