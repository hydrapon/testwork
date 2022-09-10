import { UserAuthDto } from "src/auth/dto/user-auth.dto";
import { PasswordHash } from "src/common/utils/password-hashing.service";
import { UserEntity } from "src/models/user.entity";
import { TagService } from "src/tag/tag.service";
import { Repository } from "typeorm";

import { BadRequestException, Injectable } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common/exceptions";
import { InjectRepository } from "@nestjs/typeorm";

import { AddTagForUserRequestDto } from "./dto/add-tag-for-user-request.dto";
import { AddTagForUserResponseDto } from "./dto/add-tag-for-user-response.dto";
import { GetUserResponseDto } from "./dto/get-user-response.dto";
import { UpdateUserRequestDto } from "./dto/update-user-request.dto";
import { UpdateUserResponseDto } from "./dto/update-user-response.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly tagService: TagService,
  ) {}

  async getUserWithTag(authUser: UserAuthDto): Promise<GetUserResponseDto> {
    return new GetUserResponseDto(
      (await this.userRepository.findOne({ where: { uid: authUser.uid }, relations: ["userTags"] })) as UserEntity,
    );
  }

  async updateUser(updateUserRequestDto: UpdateUserRequestDto, authUser: UserAuthDto): Promise<UpdateUserResponseDto> {
    const user = (await this.findByUId(authUser.uid)) as UserEntity;

    if (Object.keys(updateUserRequestDto).length === 0) {
      return new UpdateUserResponseDto(user);
    }

    if (updateUserRequestDto.email) {
      const checkEmail = await this.findByEmail(updateUserRequestDto.email);
      if (checkEmail) {
        throw new BadRequestException("Пользователь с таким Email уже существует");
      }
    }

    if (updateUserRequestDto.nickname) {
      const checkNickname = await this.findByNickname(updateUserRequestDto.nickname);
      if (checkNickname) {
        throw new BadRequestException("Пользователь с таким Nickname уже существует");
      }
    }

    user.email = updateUserRequestDto.email || user.email;
    user.password = updateUserRequestDto.password
      ? await PasswordHash.generatePasswordHash(updateUserRequestDto.password)
      : user.password;
    user.nickname = updateUserRequestDto.nickname || user.nickname;

    return new UpdateUserResponseDto(await this.userRepository.save(user));
  }

  async addTagsForUser(
    addTagForUserRequestDto: AddTagForUserRequestDto,
    user: UserAuthDto,
  ): Promise<AddTagForUserResponseDto> {
    const tags = await this.tagService.findByArrayIds(addTagForUserRequestDto.tags);
    if (tags.length !== addTagForUserRequestDto.tags.length) {
      throw new NotFoundException("Один из тэгов не найден");
    }
    const searchUser = (await this.findByUId(user.uid, ["tags"])) as UserEntity;
    searchUser.tags = searchUser.tags.concat(tags);
    await this.userRepository.save(searchUser);
    return new AddTagForUserResponseDto(searchUser.tags);
  }

  async deleteUser(authUser: UserAuthDto): Promise<void> {
    await this.userRepository.delete({ uid: authUser.uid });
  }

  async deleteUserTag(id: number, user: UserAuthDto): Promise<AddTagForUserResponseDto> {
    const searchUser = (await this.findByUId(user.uid, ["tags"])) as UserEntity;
    searchUser.tags = searchUser.tags.filter((tag) => tag.id != id);
    await this.userRepository.save(searchUser);
    return new AddTagForUserResponseDto(searchUser.tags);
  }

  async getUserTags(user: UserAuthDto): Promise<AddTagForUserResponseDto> {
    const searchUser = (await this.findByUId(user.uid, ["tags"])) as UserEntity;
    return new AddTagForUserResponseDto(searchUser.tags);
  }

  async findByUId(uid: string, relations: string[] = []): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { uid }, relations });
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
