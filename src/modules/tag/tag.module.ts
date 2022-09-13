import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TagEntity } from "../../models/tag.entity";
import { UserModule } from "../user/user.module";
import { TagRepository } from "./db/tag.repository";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity]), forwardRef(() => UserModule)],
  controllers: [TagController],
  providers: [TagService, TagRepository],
  exports: [TagRepository],
})
export class TagModule {}
