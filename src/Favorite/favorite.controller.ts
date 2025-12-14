import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  async findAll() {
    return await this.favoriteService.findAll();
  }

  @Post('track/:id')
  async addTrackToFavs(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const isTrackAddedToFavs = await this.favoriteService.addTrack(id);

    if (!isTrackAddedToFavs) {
      throw new UnprocessableEntityException('Track not found');
    }
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrackFromFavs(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const isTrackRemovedFromFavs = await this.favoriteService.removeTrack(id);

    if (!isTrackRemovedFromFavs) {
      throw new UnprocessableEntityException('Track not found');
    }
  }

  @Post('album/:id')
  async addAlbumToFavs(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const isAlbumAddedToFavs = await this.favoriteService.addAlbum(id);

    if (!isAlbumAddedToFavs) {
      throw new UnprocessableEntityException('Album not found');
    }
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbumFromFavs(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const isAlbumRemovedFromFavs = await this.favoriteService.removeAlbum(id);

    if (!isAlbumRemovedFromFavs) {
      throw new UnprocessableEntityException('Album not found');
    }
  }

  @Post('artist/:id')
  async addArtistToFavs(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const isArtistAddedToFavs = await this.favoriteService.addArtist(id);

    if (!isArtistAddedToFavs) {
      throw new UnprocessableEntityException('Artist not found');
    }
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtistFromFavs(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const isArtistRemovedFromFavs = await this.favoriteService.removeArtist(id);

    if (!isArtistRemovedFromFavs) {
      throw new UnprocessableEntityException('Artist not found');
    }
  }
}
