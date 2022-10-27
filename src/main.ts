import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new Logger() });
  app.enableCors();

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  await app.listen(PORT).then(() => {
    Logger.log(`Server running on port ${PORT}`);
  });
}
bootstrap();
