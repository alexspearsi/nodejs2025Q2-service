import { Module } from '@nestjs/common';
import { UserModule } from './User/user.module';
import { ArtistModule } from './Artist/artist.module';
import { AlbumModule } from './Album/album.module';
import { TrackModule } from './Track/track.module';
import { FavoriteModule } from './Favorite/favorite.module';
import { PrismaModule } from './Prisma/prisma.module';
import { AuthModule } from './Auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './Auth/guards/jwt/jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
    }),
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavoriteModule,
    PrismaModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
