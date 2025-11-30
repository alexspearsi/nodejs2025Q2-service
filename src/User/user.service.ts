import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './entities/user';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  private users: UserEntity[] = [];

  findAll() {
    return this.users.map((user) => {
      const sanitizedUser = { ...user };
      delete sanitizedUser.password;

      return sanitizedUser;
    });
  }

  findOne(id: string): Omit<UserEntity, 'password'> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const santizedUser = { ...user };
    delete santizedUser.password;

    return santizedUser;
  }

  create(dto: CreateUserDto): Omit<UserEntity, 'password'> {
    if (!dto.login || !dto.password) {
      throw new BadRequestException('Invalid data');
    }

    const user: UserEntity = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(user);

    const sanitizedUser = { ...user };
    delete sanitizedUser.password;

    return sanitizedUser;
  }

  remove(id: string) {
    const index = this.users.findIndex((user) => user.id === id);

    if (index < 0) {
      throw new NotFoundException('User not found');
    }

    this.users.splice(index, 1);
  }

  updatePassword(id: string, dto: UpdatePasswordDto) {
    if (!dto.oldPassword || !dto.newPassword) {
      throw new BadRequestException('Invalid data');
    }

    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = dto.newPassword;
    user.updatedAt = Date.now();
    user.version = user.version + 1;
  }
}
