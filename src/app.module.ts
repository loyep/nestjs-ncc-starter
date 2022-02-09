import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import LoggerModule from './common/logger/logger.module';
import PrismaModule from './common/prisma/prisma.module';

@Module({
  imports: [LoggerModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
