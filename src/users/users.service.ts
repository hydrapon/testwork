import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDro } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.model';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

enum UserParamEnum {
    EMAIL = 'email',
    PHONE = 'phone'
}

enum SearchParamEnum {
    EMAIL = 'email',
    PHONE = 'phone',
    NAME = 'name',
    PAGE = 'page'
}

interface RequestWithUser extends Request {
    user: User
}

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
    constructor(@InjectModel(User) private userRepo: typeof User,
        @Inject(REQUEST) private readonly request: RequestWithUser) { }

    async createUser(dto: CreateUserDto) {
        const { role, ...userData } = dto;
        if (dto.hasOwnProperty(UserParamEnum.EMAIL) || dto.hasOwnProperty(UserParamEnum.PHONE)) {
            console.log('ok params')
            try {
                const user = await this.userRepo.create(userData);
                return user;
            } catch (e) {
                console.log(e)
                throw new HttpException('user with such an email or phone already exists', HttpStatus.BAD_REQUEST)
            }

        }
        console.log('error params')
        throw new HttpException('no phone number or email', HttpStatus.BAD_REQUEST)
    }

    async getAllUsers(dto: SearchUserDro) {
        let searchParams: Record<string, string> = {};
        Object.keys(dto).forEach((keyDto) => {
            if (Object.values(SearchParamEnum).find(valueEnum => valueEnum === keyDto) && keyDto !== SearchParamEnum.PAGE) {
                searchParams[keyDto] = String(dto[keyDto])
            }
        });
        let confFindParams: Record<string, string | number | SearchUserDro> = {
            limit: 10,
            offset: dto.hasOwnProperty(SearchParamEnum.PAGE) ? ((Number(dto.page) < 0 ? 0 : Number(dto.page)) - 1) * 10 : 0
        }
        if (Object.keys(searchParams).length !== 0) {
            confFindParams['where'] = searchParams
        }

        console.log(dto, 'tut')
        const users = await this.userRepo.findAll(confFindParams);
        if (users === null) {
            return []
        }
        return users
    }

    async getOneUser(id: number) {
        const users = await this.userRepo.findByPk(id)
        if (users === null) {
            return null
        }
        return users
    }

    async getUserByPhone(phone: string | undefined) {
        const user = await this.userRepo.findOne({ where: { phone: phone } })
        return user
    }
    async getUserByEmail(email: string | undefined) {
        const user = await this.userRepo.findOne({ where: { email: email } })
        return user
    }

    async deleteUser(id: number) {
        return await this.userRepo.destroy({ where: { id: id } })
    }

    async updateUser(dto: UpdateUserDto, idUser: number = 0) {
        let { role, ...UserData } = dto;
        if (idUser !== 0) {
            UserData = dto;
        }
        const { id, ...updateUserData } = UserData;
        return await this.userRepo.update(updateUserData, {
            where: {
                id: idUser === 0 ? this.request.user.id : idUser
            }
        })
    }
}
