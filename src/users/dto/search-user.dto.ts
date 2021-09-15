import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

class SearchParam {
    @ApiProperty({ example: 'emailLogin@example.com', description: 'user email' })
    @IsOptional()
    @IsString({ message: 'must be a string' })
    @IsEmail({}, { message: 'invalid email' })
    readonly email?: string;

    @ApiProperty({ example: '+79008887766', description: 'user phone' })
    @IsOptional()
    @IsPhoneNumber("RU")
    readonly phone?: string;

    @ApiProperty({ example: 'Petya', description: 'user name' })
    readonly name?: string;

    @ApiProperty({ example: '1', description: 'page get user' })
    readonly page?: number;
}

export class SearchUserDro extends SearchParam {
    readonly [index: string]: string | undefined | number;
}