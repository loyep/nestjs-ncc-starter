import { INestApplication } from '@nestjs/common';

export default async function bootstrap(
  app: INestApplication,
  listening: boolean = true,
) {
  app.enableShutdownHooks();
  if (listening) {
    await app.listen(3000);
  }
}
