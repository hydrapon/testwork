import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTagRequestDto {
  @IsString({ message: "Имя должен быть строкой" })
  @IsNotEmpty({ message: "Имя не может быть пустым" })
  readonly name: string;

  @IsNumber({}, { message: "Параметр должен быть числом" })
  @IsOptional()
  readonly sortOrder?: number;
}
