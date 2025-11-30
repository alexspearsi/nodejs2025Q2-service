import { Module } from '@nestjs/common';
import { UserModule } from './User/user.module';
import { ArtistModule } from './Artist/artist.module';
import { AlbumModule } from './Album/album.module';

@Module({
  imports: [UserModule, ArtistModule, AlbumModule],
})
export class AppModule {}
