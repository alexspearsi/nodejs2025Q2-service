import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AlbumEntity } from './entities/album';
import { CreateAlbumDto } from './dto/create-album.dto';
import { randomUUID } from 'crypto';
import { db } from 'src/DB/db';

export class AlbumService {
  private albums: AlbumEntity[] = db.albums;

  findAll() {
    return this.albums;
  }

  findOne(id: string): AlbumEntity {
    const album = this.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  create(dto: CreateAlbumDto): AlbumEntity {
    if (typeof dto.name !== 'string' || typeof dto.year !== 'number') {
      throw new BadRequestException('Invalid data');
    }

    const newAlbum = {
      id: randomUUID(),
      year: dto.year,
      name: dto.name,
      artistId: dto.artistId ?? null,
    };

    this.albums.push(newAlbum);

    return newAlbum;
  }

  update(id: string, dto: CreateAlbumDto): AlbumEntity {
    if (typeof dto.name !== 'string' || typeof dto.year !== 'number') {
      throw new BadRequestException('Invalid data');
    }

    const album = this.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    album.name = dto.name;
    album.year = dto.year;
    album.artistId = dto.artistId ?? null;

    return album;
  }

  remove(id: string) {
    const index = this.albums.findIndex((album) => album.id === id);

    if (index < 0) {
      throw new NotFoundException('Album not found');
    }

    this.albums.splice(index, 1);

    db.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }

      return track;
    });

    const indexInFav = db.favorites.albums.findIndex(
      (album) => album.id === id,
    );

    if (indexInFav > -1) {
      db.favorites.albums.splice(indexInFav, 1);
    }
  }
}
