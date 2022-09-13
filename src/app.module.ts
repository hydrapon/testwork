import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { jwtOptions } from "./auth/options/auth.options";
import { TagModule } from "./modules/tag/tag.module";
import { UserModule } from "./modules/user/user.module";
import * as ormConfig from "./ormconfig";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    JwtModule.register({
      secret: jwtOptions.secret,
    }),
    UserModule,
    AuthModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
