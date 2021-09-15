import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';

enum UserParamEnum {
    EMAIL = 'email',
    PHONE = 'phone'
}

@Injectable()
export class AuthService {

    constructor(private userService: UsersService, private jwtService: JwtService) { }

    async login(dto: CreateUserDto) {
        const user = await this.validateUser(dto)
        return this.generateToken(user);
    }

    async registration(dto: CreateUserDto) {
        const hashPassword = await bcrypt.hash(dto.password, 8);
        const user = await this.userService.createUser({ ...dto, password: hashPassword });
        return this.generateToken(user);
    }

    private async generateToken(user: User) {
        const payload = { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role };
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(dto: CreateUserDto) {
        if (dto.hasOwnProperty(UserParamEnum.EMAIL)) {
            const user = await this.userService.getUserByEmail(dto.email)
            if (user !== null) {
                const checkPassword = await bcrypt.compare(dto.password, user.password)
                if (checkPassword) {
                    return user
                }
                throw new UnauthorizedException({ message: 'invalid password' })
            }
            throw new UnauthorizedException({ message: 'invalid email' })
        } else if (dto.hasOwnProperty(UserParamEnum.PHONE)) {
            const user = await this.userService.getUserByPhone(dto.phone)
            if (user !== null) {
                const checkPassword = await bcrypt.compare(dto.password, user.password)
                if (checkPassword) {
                    return user
                }
                throw new UnauthorizedException({ message: 'invalid password' })
            }
            throw new UnauthorizedException({ message: 'invalid phone' })
        } else {
            throw new HttpException('no phone number or email', HttpStatus.BAD_REQUEST)
        }
    }
}
