import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TrackEntity } from './entities/track';
import { CreateTrackDto } from './dto/create-track.dto';
import { randomUUID } from 'crypto';
import { db } from 'src/DB/db';

export class TrackService {
  private tracks: TrackEntity[] = db.tracks;

  findAll() {
    return this.tracks;
  }

  findOne(id: string): TrackEntity {
    const track = this.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  create(dto: CreateTrackDto): TrackEntity {
    if (typeof dto.name !== 'string' || typeof dto.duration !== 'number') {
      throw new BadRequestException('Invalid data');
    }

    const newTrack: TrackEntity = {
      id: randomUUID(),
      name: dto.name,
      artistId: dto.artistId ?? null,
      albumId: dto.albumId ?? null,
      duration: dto.duration,
    };

    this.tracks.push(newTrack);

    return newTrack;
  }

  update(id: string, dto: CreateTrackDto): TrackEntity {
    if (typeof dto.name !== 'string' || typeof dto.duration !== 'number') {
      throw new BadRequestException('Invalid data');
    }

    const track = this.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    track.duration = dto.duration;
    track.name = dto.name;
    track.albumId = dto.albumId || null;
    track.artistId = dto.artistId || null;

    return track;
  }

  remove(id: string) {
    const index = this.tracks.findIndex((track) => track.id === id);

    if (index < 0) {
      throw new NotFoundException('Track not found');
    }

    this.tracks.splice(index, 1);

    const indexInFav = db.favorites.tracks.findIndex(
      (track) => track.id === id,
    );

    if (indexInFav > -1) {
      db.favorites.tracks.splice(indexInFav, 1);
    }
  }
}
