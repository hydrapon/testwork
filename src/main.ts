import "dotenv/config";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<any> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    exposedHeaders: "content-disposition",
  });
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));
  if (process.env["SWAGGER"] === "enabled") {
    const config = new DocumentBuilder()
      .setTitle("test-work-back")
      .setDescription("API for testwork")
      .setVersion("0.0.1")
      .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header" }, "access-token")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("doc", app, document);
  }

  await app.listen(process.env["PORT"] || 3000);
}
bootstrap();
