import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { PasswordHash } from "src/common/utils/password-hashing.service";
import { UserEntity } from "src/models/user.entity";
import { v4 as uuidv4 } from "uuid";

export class CreateUserRequestDto {
  @IsString({ message: "Email должен быть строкой" })
  @IsNotEmpty({ message: "Email не может быть пустым" })
  @IsEmail({}, { message: "Неверный формат email" })
  readonly email: string;

  @IsString({ message: "Пароль должен быть строкой" })
  @IsNotEmpty({ message: "Пароль не может быть пустым" })
  @MinLength(8, { message: "Пароль слишком короткий" })
  @MaxLength(30, { message: "Пароль слишком длинный" })
  @Matches(/((?=.*\d))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Пароль должен содержать буквы латинского языка и цифры, а так же содержать строчные и прописные буквы",
  })
  public password: string;

  @IsString({ message: "Никнейм должен быть строкой" })
  @IsNotEmpty({ message: "Никнейм не может быть пустым" })
  readonly nickname: string;

  static async MapToEntity(createUserRequestDto: CreateUserRequestDto) {
    const user = new UserEntity();
    user.email = createUserRequestDto.email;
    user.nickname = createUserRequestDto.nickname;
    user.password = await PasswordHash.generatePasswordHash(createUserRequestDto.password);
    user.uid = await uuidv4();
    return user;
  }
}
