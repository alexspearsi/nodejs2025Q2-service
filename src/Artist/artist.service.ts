import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ArtistEntity } from './entities/artist';
import { CreateArtistDto } from './dto/create-artist.dto';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const artist = await this.prisma.artist.findMany();
    return artist;
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async create(dto: CreateArtistDto) {
    if (typeof dto.name !== 'string' || typeof dto.grammy !== 'boolean') {
      throw new BadRequestException('Invalid data');
    }

    const newArtist: ArtistEntity = {
      ...dto,
      id: randomUUID(),
    };

    return await this.prisma.artist.create({
      data: newArtist,
    });
  }

  async remove(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    await this.prisma.artist.delete({
      where: { id },
    });

    this.prisma.track.updateMany({
      where: { artistId: id },
      data: {
        artistId: null,
      },
    });

    this.prisma.album.updateMany({
      where: { artistId: id },
      data: {
        artistId: null,
      },
    });

    const allFavs = await this.prisma.favorites.findMany({
      where: { artists: { has: id } },
    });

    for (const fav of allFavs) {
      await this.prisma.favorites.update({
        where: { id: fav.id },
        data: {
          artists: fav.artists.filter((artistId) => artistId !== id),
        },
      });
    }
  }

  async update(id: string, dto: CreateArtistDto) {
    if (typeof dto.name !== 'string' || typeof dto.grammy !== 'boolean') {
      throw new BadRequestException('Invalid data');
    }

    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return await this.prisma.artist.update({
      where: { id },
      data: {
        grammy: dto.grammy,
        name: dto.name,
      },
    });
  }
}
