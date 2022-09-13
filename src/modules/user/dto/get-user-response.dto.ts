import { UserEntity } from "src/models/user.entity";

import { TagResponseDto } from "../../tag/dto/tag-response.dto";

export class GetUserResponseDto {
  readonly email: string;
  readonly nickname: string;
  readonly tags: TagResponseDto[];

  constructor(user: UserEntity) {
    this.email = user.email;
    this.nickname = user.nickname;
    this.tags = user.userTags.map((tag) => new TagResponseDto(tag));
  }
}
