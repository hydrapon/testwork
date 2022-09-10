import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTagRequestDto {
  @IsNotEmpty({ message: "Имя тэга не может быть пустым" })
  @IsString({ message: "Имя тэга должно быть строкой" })
  @IsOptional()
  readonly name?: string;

  @IsNotEmpty({ message: "sortOrder не может быть пустым" })
  @IsNumber({}, { message: "sortOrder должен быть числом" })
  @IsOptional()
  readonly sortOrder?: number;
}
