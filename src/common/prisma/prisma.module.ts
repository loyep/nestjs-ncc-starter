import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export default class PrismaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
