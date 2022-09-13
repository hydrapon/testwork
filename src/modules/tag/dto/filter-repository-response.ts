import { TagEntity } from "src/models/tag.entity";

export class FilterRepositoryResponse {
  readonly tags: TagEntity[];
  readonly count: number | null;
  readonly take: number;
}
