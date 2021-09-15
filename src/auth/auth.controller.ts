import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from 'src/pipes/validation.pipes';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthUser } from './dto/auth-user.dto';

class responseRegistration {
    @ApiProperty({ example: '*hash_code*', description: 'auth token key' })
    readonly token: string
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: 'Authorization user' })
    @ApiResponse({ status: 200, type: responseRegistration })
    @UsePipes(ValidationPipe)
    @Post('/login')
    login(@Body() userDto: AuthUser) {
        return this.authService.login(userDto)
    }

    @ApiOperation({ summary: 'Registration user' })
    @ApiResponse({ status: 200, type: responseRegistration })
    @UsePipes(ValidationPipe)
    @Post('/registration')
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto)
    }
}
