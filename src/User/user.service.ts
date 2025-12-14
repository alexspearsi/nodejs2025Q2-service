import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'src/Prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private salt = Number(process.env.CRYPT_SALT ?? 10);

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

    const user = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });

    if (user) {
      return this.sanitizeUser(user);
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.salt);
    const now = Date.now();

    const newUser = {
      id: randomUUID(),
      login: dto.login,
      password: hashedPassword,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    await this.prisma.user.create({
      data: newUser,
    });

    return this.sanitizeUser(newUser);
  }

  async findByLogin(login: string) {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      throw new NotFoundException('User not fond');
    }

    return user;
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

    const isValidOldPassword = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );

    if (!isValidOldPassword) {
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

  async setRefreshToken(id: string, refreshToken: string | null) {
    await this.prisma.user.update({
      where: { id },
      data: {
        refreshToken,
        version: { increment: 1 },
        updatedAt: Date.now(),
      },
    });
  }
}
