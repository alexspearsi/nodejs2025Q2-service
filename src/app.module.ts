import { Module } from '@nestjs/common';
import { UserModule } from './User/user.module';
import { ArtistModule } from './Artist/artist.module';
import { AlbumModule } from './Album/album.module';
import { TrackModule } from './Track/track.module';
import { FavoriteModule } from './Favorite/favorite.module';

@Module({
  imports: [UserModule, ArtistModule, AlbumModule, TrackModule, FavoriteModule],
})
export class AppModule {}
