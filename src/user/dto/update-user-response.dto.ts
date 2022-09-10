import { UserEntity } from "src/models/user.entity";

export class UpdateUserResponseDto {
  readonly email: string;
  readonly nickname: string;

  constructor(user: UserEntity) {
    this.email = user.email;
    this.nickname = user.nickname;
  }
}
