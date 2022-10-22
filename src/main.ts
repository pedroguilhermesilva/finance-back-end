import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new Logger() });
  app.enableCors();
  await app.listen(3001).then(() => {
    Logger.log('Server running on port 3001');
  });
}
bootstrap();
