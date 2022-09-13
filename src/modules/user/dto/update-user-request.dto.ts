import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateUserRequestDto {
  @IsString({ message: "Email должен быть строкой" })
  @IsNotEmpty({ message: "Email не может быть пустым" })
  @IsEmail({}, { message: "Неверный формат email" })
  @IsOptional()
  readonly email?: string;

  @IsString({ message: "Пароль должен быть строкой" })
  @IsNotEmpty({ message: "Пароль не может быть пустым" })
  @MinLength(8, { message: "Пароль слишком короткий" })
  @MaxLength(30, { message: "Пароль слишком длинный" })
  @Matches(/((?=.*\d))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Пароль должен содержать буквы латинского языка и цифры, а так же содержать строчные и прописные буквы",
  })
  @IsOptional()
  public password?: string;

  @IsString({ message: "Никнейм должен быть строкой" })
  @IsNotEmpty({ message: "Никнейм не может быть пустым" })
  @IsOptional()
  readonly nickname?: string;
}
