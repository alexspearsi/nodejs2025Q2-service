import { Module } from '@nestjs/common';
import { UserModule } from './User/user.module';
import { ArtistModule } from './Artist/artist.module';

@Module({
  imports: [UserModule, ArtistModule],
})
export class AppModule {}
