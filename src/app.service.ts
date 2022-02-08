import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from './common/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getUsers(): Promise<User[]> {
    const user = await this.prisma.user.findMany();
    return user;
  }
}
