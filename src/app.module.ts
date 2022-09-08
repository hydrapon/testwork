import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TagModule } from './tag/tag.module';
import * as ormConfig from "./ormconfig";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    UserModule,
    AuthModule,
    TagModule,
  ],
})
export class AppModule { }
