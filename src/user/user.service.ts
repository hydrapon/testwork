import { UserEntity } from "src/models/user.entity";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findByUId(uid: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { uid } });
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByNickname(nickname: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { nickname } });
  }

  async createUser(userEntity: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(userEntity);
  }
}
