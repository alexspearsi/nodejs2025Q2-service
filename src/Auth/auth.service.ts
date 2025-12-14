import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from 'src/User/user.service';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  private tokenKey: string = process.env.JWT_SECRET_KEY ?? '';
  private refreshTokenKey: string = process.env.JWT_SECRET_REFRESH_KEY ?? '';

  private tokenKeyExpireTime = process.env.TOKEN_EXPIRE_TIME ?? '1h';
  private refreshTokenKeyExpireTime =
    process.env.TOKEN_REFRESH_EXPIRE_TIME ?? '24h';

  async signup(dto: SignUpDto) {
    const hash = await bcrypt.hash(dto.password, 10);

    await this.userService.create({
      login: dto.login,
      password: hash,
    });

    return { message: 'User created successfully' };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByLogin(dto.login);

    if (!user) {
      throw new ForbiddenException('Invalid login or password');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new ForbiddenException('Invalid password');
    }

    const tokens = this.generateTokens(user);
    await this.userService.setRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private generateTokens(user) {
    const payload = {
      userId: user.id,
      login: user.login,
    };

    const accessToken = jwt.sign(payload, this.tokenKey, {
      expiresIn: this.tokenKeyExpireTime,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, this.refreshTokenKey, {
      expiresIn: this.refreshTokenKeyExpireTime,
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }
}
