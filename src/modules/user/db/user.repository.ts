import { DeleteResult, Repository } from "typeorm";

import { InjectRepository } from "@nestjs/typeorm";

import { UserEntity } from "../../../models/user.entity";

export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findByUid(uid: string, relations: string[] = []): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { uid }, relations });
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }

  async delete(uid: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ uid });
  }

  async findByUId(uid: string, relations: string[] = []): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { uid }, relations });
  }

  async findByEmail(email: string, relations: string[] = []): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { email }, relations });
  }

  async findByNickname(nickname: string, relations: string[] = []): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { nickname }, relations });
  }
}
