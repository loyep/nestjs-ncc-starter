import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import bootstrap from './bootstrap';
import { LoggerService } from './common/logger/logger.service';

async function main() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });
  await bootstrap(app);
}

main().catch((e) => {
  process.exit();
});
