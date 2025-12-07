import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TrackEntity } from './entities/track';
import { CreateTrackDto } from './dto/create-track.dto';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const tracks = await this.prisma.track.findMany();
    return tracks;
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async create(dto: CreateTrackDto) {
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

    return await this.prisma.track.create({
      data: newTrack,
    });
  }

  async update(id: string, dto: CreateTrackDto) {
    if (typeof dto.name !== 'string' || typeof dto.duration !== 'number') {
      throw new BadRequestException('Invalid data');
    }

    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return await this.prisma.track.update({
      where: { id },
      data: {
        duration: dto.duration,
        name: dto.name,
        albumId: dto.albumId || null,
        artistId: dto.artistId || null,
      },
    });
  }

  async remove(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    await this.prisma.track.delete({
      where: { id },
    });

    const allFavs = await this.prisma.favorites.findMany({
      where: { tracks: { has: id } },
    });

    for (const fav of allFavs) {
      await this.prisma.favorites.update({
        where: { id: fav.id },
        data: {
          tracks: fav.tracks.filter((trackId) => trackId !== id),
        },
      });
    }
  }
}
