import { db } from 'src/DB/db';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export class FavoriteService {
  findAll() {
    return db.favorites;
  }

  addTrack(id: string) {
    const track = db.tracks.find((track) => track.id === id);

    if (!track) {
      throw new UnprocessableEntityException('Track does not exist');
    }

    db.favorites.tracks.push(track);
  }

  addAlbum(id: string) {
    const album = db.albums.find((album) => album.id === id);

    if (!album) {
      throw new UnprocessableEntityException('Track does not exist');
    }

    db.favorites.albums.push(album);
  }

  addArtist(id: string) {
    const artist = db.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new UnprocessableEntityException('Track does not exist');
    }

    db.favorites.artists.push(artist);
  }

  removeTrack(id: string) {
    const indexInDB = db.tracks.findIndex((track) => track.id === id);

    if (indexInDB < 0) {
      throw new NotFoundException('Track not found');
    }

    const indexInFav = db.favorites.tracks.findIndex(
      (track) => track.id === id,
    );

    if (indexInFav < 0) {
      throw new NotFoundException('Track not found in favorites');
    }

    db.favorites.tracks.splice(indexInFav, 1);
  }

  removeAlbum(id: string) {
    const indexInDB = db.albums.findIndex((album) => album.id === id);

    if (indexInDB < 0) {
      throw new NotFoundException('Album not found');
    }

    const indexInFav = db.favorites.albums.findIndex(
      (track) => track.id === id,
    );

    if (indexInFav < 0) {
      throw new NotFoundException('Album not found in favorites');
    }

    db.favorites.albums.splice(indexInFav, 1);
  }

  removeArtist(id: string) {
    const index = db.artists.findIndex((artist) => artist.id === id);

    if (index < 0) {
      throw new NotFoundException('Artist not found');
    }

    const indexInFav = db.favorites.artists.findIndex(
      (artist) => artist.id === id,
    );

    if (indexInFav < 0) {
      throw new NotFoundException('Artist not found in favorites');
    }

    db.favorites.artists.splice(indexInFav, 1);
  }
}
