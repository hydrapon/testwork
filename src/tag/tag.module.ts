import { TagEntity } from "src/models/tag.entity";
import { UserModule } from "src/user/user.module";

import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity]), forwardRef(() => UserModule)],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
