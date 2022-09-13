import { Transform } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class FilterTagsRequestDto {
  @IsInt()
  @Min(1)
  @Transform((v) => Number(v.value))
  @IsOptional()
  readonly page?: number;

  @IsInt()
  @Min(1)
  @Transform((v) => Number(v.value))
  @IsOptional()
  readonly pageSize?: number;
}
