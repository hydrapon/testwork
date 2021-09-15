import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { ValidationPipe } from 'src/pipes/validation.pipes';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDro } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

enum RolesNameEnum {
    USER = 1,
    ADMIN = 2
}
class responseUserDelete {
    @ApiProperty({ example: '1', description: 'count user delete' })
    readonly count: number
}

class responseUserUpdate {
    @ApiProperty({ example: '[1]', description: 'count user update' })
    readonly count: [number]
}

@ApiTags('Users')
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({ status: 200, type: User })
    @UsePipes(ValidationPipe)
    @Post()
    @UseGuards(JwtAuthGuard)
    @Role(RolesNameEnum.ADMIN)
    @UseGuards(RoleGuard)
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, type: [User] })
    @UsePipes(ValidationPipe)
    @Get()
    @UseGuards(JwtAuthGuard)
    @Role(RolesNameEnum.ADMIN)
    @UseGuards(RoleGuard)
    getAll(@Query() searchDto: SearchUserDro) {
        return this.usersService.getAllUsers(searchDto);
    }

    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({ status: 200, type: User })
    @UsePipes(ValidationPipe)
    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    @Role(RolesNameEnum.ADMIN)
    @UseGuards(RoleGuard)
    getOne(@Param('id') id: number) {
        return this.usersService.getOneUser(id)
    }

    @ApiOperation({ summary: 'update your params' })
    @ApiResponse({ status: 200, type: responseUserUpdate })
    @UsePipes(ValidationPipe)
    @Put()
    @UseGuards(JwtAuthGuard)
    @Role(RolesNameEnum.USER)
    @UseGuards(RoleGuard)
    update(@Body() updateDto: UpdateUserDto) {
        return this.usersService.updateUser(updateDto)
    }

    @ApiOperation({ summary: 'update params of another user' })
    @ApiResponse({ status: 200, type: responseUserUpdate })
    @UsePipes(ValidationPipe)
    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    @Role(RolesNameEnum.ADMIN)
    @UseGuards(RoleGuard)
    updateUser(@Body() updateDto: UpdateUserDto, @Param('id') id: number) {
        return this.usersService.updateUser(updateDto, id)
    }

    @ApiOperation({ summary: 'delete users' })
    @ApiResponse({ status: 200, type: responseUserDelete })
    @UsePipes(ValidationPipe)
    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    @Role(RolesNameEnum.ADMIN)
    @UseGuards(RoleGuard)
    delete(@Param('id') id: number) {
        return this.usersService.deleteUser(id);
    }
}
