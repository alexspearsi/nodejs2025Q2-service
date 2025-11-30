import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ArtistEntity } from './entities.ts/artist';
import { CreateArtistDto } from './dto/create-artist.dto';
import { randomUUID } from 'crypto';

export class ArtistService {
  private artists: ArtistEntity[] = [];

  findAll(): ArtistEntity[] {
    return this.artists;
  }

  findOne(id: string): ArtistEntity {
    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  create(dto: CreateArtistDto): ArtistEntity {
    if (typeof dto.name !== 'string' || typeof dto.grammy !== 'boolean') {
      throw new BadRequestException('Invalid data');
    }

    const newArtist: ArtistEntity = {
      ...dto,
      id: randomUUID(),
    };

    this.artists.push(newArtist);

    return newArtist;
  }

  remove(id: string) {
    const index = this.artists.findIndex((artist) => artist.id === id);

    if (index < 0) {
      throw new NotFoundException('Artist not found');
    }

    this.artists.splice(index, 1);
  }

  update(id: string, dto: CreateArtistDto): ArtistEntity {
    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    if (typeof dto.name !== 'string' || typeof dto.grammy !== 'boolean') {
      throw new BadRequestException('Invalid data');
    }

    artist.grammy = dto.grammy;
    artist.name = dto.name;

    return artist;
  }
}
