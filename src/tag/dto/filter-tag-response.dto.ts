import { MetagTagFilterDto } from "./meta-tag-filter.dto";
import { TagWithCreatorResponseDto } from "./tag-with-creator-response.dto";

export class FilterTagsResponseDto {
  readonly data: TagWithCreatorResponseDto[];
  readonly meta: MetagTagFilterDto;

  constructor(data: TagWithCreatorResponseDto[], meta: MetagTagFilterDto) {
    this.data = data;
    this.meta = meta;
  }
}
