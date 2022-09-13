import { BadRequestException, Injectable } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common/exceptions";

import { UserAuthDto } from "../../auth/dto/user-auth.dto";
import { PasswordHash } from "../../common/utils/password-hashing.service";
import { UserEntity } from "../../models/user.entity";
import { TagRepository } from "../tag/db/tag.repository";
import { UserRepository } from "./db/user.repository";
import { AddTagForUserRequestDto } from "./dto/add-tag-for-user-request.dto";
import { AddTagForUserResponseDto } from "./dto/add-tag-for-user-response.dto";
import { GetUserResponseDto } from "./dto/get-user-response.dto";
import { UpdateUserRequestDto } from "./dto/update-user-request.dto";
import { UpdateUserResponseDto } from "./dto/update-user-response.dto";

@Injectable()
export class UserService {
  constructor(private readonly tagRepository: TagRepository, private readonly userRepository: UserRepository) {}

  async getUserWithTag(authUser: UserAuthDto): Promise<GetUserResponseDto> {
    return new GetUserResponseDto((await this.userRepository.findByUid(authUser.uid, ["userTags"])) as UserEntity);
  }

  async updateUser(updateUserRequestDto: UpdateUserRequestDto, authUser: UserAuthDto): Promise<UpdateUserResponseDto> {
    const user = (await this.userRepository.findByUId(authUser.uid)) as UserEntity;

    if (Object.keys(updateUserRequestDto).length === 0) {
      return new UpdateUserResponseDto(user);
    }

    if (updateUserRequestDto.email) {
      const checkEmail = await this.userRepository.findByEmail(updateUserRequestDto.email);
      if (checkEmail) {
        throw new BadRequestException("Пользователь с таким Email уже существует");
      }
    }

    if (updateUserRequestDto.nickname) {
      const checkNickname = await this.userRepository.findByNickname(updateUserRequestDto.nickname);
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
    const tags = await this.tagRepository.findByArrayIds(addTagForUserRequestDto.tags);
    if (tags.length !== addTagForUserRequestDto.tags.length) {
      throw new NotFoundException("Один из тэгов не найден");
    }
    const searchUser = (await this.userRepository.findByUId(user.uid, ["tags"])) as UserEntity;
    searchUser.tags = searchUser.tags.concat(tags);
    await this.userRepository.save(searchUser);
    return new AddTagForUserResponseDto(searchUser.tags);
  }

  async deleteUser(authUser: UserAuthDto): Promise<void> {
    await this.userRepository.delete(authUser.uid);
  }

  async deleteUserTag(id: number, user: UserAuthDto): Promise<AddTagForUserResponseDto> {
    const searchUser = (await this.userRepository.findByUId(user.uid, ["tags"])) as UserEntity;
    searchUser.tags = searchUser.tags.filter((tag) => tag.id != id);
    await this.userRepository.save(searchUser);
    return new AddTagForUserResponseDto(searchUser.tags);
  }

  async getUserTags(user: UserAuthDto): Promise<AddTagForUserResponseDto> {
    const searchUser = (await this.userRepository.findByUId(user.uid, ["tags"])) as UserEntity;
    return new AddTagForUserResponseDto(searchUser.tags);
  }

  async createUser(userEntity: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(userEntity);
  }
}
