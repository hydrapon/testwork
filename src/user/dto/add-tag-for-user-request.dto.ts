import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class AddTagForUserRequestDto {
  @IsArray({ message: "ID Тэгов должны массивом" })
  @IsNotEmpty({ message: "ID Тэгов обязательный параметр", each: true })
  @IsNumber({}, { each: true, message: "ID Тэгов должны в массиве быть числом" })
  readonly tags: number[];
}
