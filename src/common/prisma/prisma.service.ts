import {
  INestApplication,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements
    OnModuleInit,
    OnApplicationShutdown,
    OnModuleDestroy,
    OnApplicationBootstrap
{
  constructor() {
    super();
  }

  onApplicationShutdown(signal?: string) {
    this.$disconnect();
  }

  onModuleDestroy() {}

  onApplicationBootstrap() {}

  async onModuleInit() {
    await this.$connect();
  }
}
