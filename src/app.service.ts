import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from './common/prisma/prisma.service';

const awaitTimeout = (time: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello(): Promise<string> {
    // await awaitTimeout(2000)
    return 'Hello World!';
  }

  async getUsers(): Promise<User[]> {
    const user = await this.prisma.user.findMany();
    return user;
  }
}
