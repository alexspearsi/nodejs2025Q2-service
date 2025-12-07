import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { UserEntity } from './entities/user';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { UpdatePasswordDto } from './dto/update-password.dto';
// import { db } from 'src/DB/db';
import { PrismaService } from 'src/Prisma/prisma.service';
// import { UserEntity } from './entities/user';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private sanitizeUser(user) {
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.sanitizeUser(user));
  }

  async create(dto: CreateUserDto) {
    if (!dto.login || !dto.password) {
      throw new BadRequestException('Invalid data');
    }

    const now = Date.now();

    const user = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    await this.prisma.user.create({
      data: user,
    });

    return this.sanitizeUser(user);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    if (!dto.oldPassword || !dto.newPassword) {
      throw new BadRequestException('Invalid data');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updateUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: dto.newPassword,
        version: user.version + 1,
        updatedAt: Date.now(),
      },
    });

    return this.sanitizeUser(updateUser);
  }
}
