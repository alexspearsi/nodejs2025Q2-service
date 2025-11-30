import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AlbumEntity } from './entities/album';
import { CreateAlbumDto } from './dto/create-album.dto';
import { randomUUID } from 'crypto';

export class AlbumService {
  private albums: AlbumEntity[] = [];

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
      artistId: null,
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
  }
}
