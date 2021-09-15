import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class AuthUser {
    @ApiProperty({ example: 'emailLogin@example.com', description: 'user email' })
    @IsOptional()
    @IsString({ message: 'must be a string' })
    @IsEmail({}, { message: 'invalid email' })
    readonly email?: string;

    @ApiProperty({ example: '+79008887766', description: 'user phone' })
    @IsOptional()
    @IsPhoneNumber("RU")
    readonly phone?: string;

    @ApiProperty({ example: 'Hard_12_PAssworD', description: 'user password' })
    @IsString({ message: 'must be a string' })
    @Length(4, 16, { message: 'no less than 4 and no more than 16 characters' })
    readonly password: string;
}