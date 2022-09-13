import { UserEntity } from "src/models/user.entity";

export class UserCreatorDto {
  readonly nickname: string;
  readonly uid: string;

  constructor(user: UserEntity) {
    this.nickname = user.nickname;
    this.uid = user.uid;
  }
}
