import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const albums = await this.prisma.album.findMany();
    return albums;
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async create(dto: CreateAlbumDto) {
    if (typeof dto.name !== 'string' || typeof dto.year !== 'number') {
      throw new BadRequestException('Invalid data');
    }

    const newAlbum = {
      id: randomUUID(),
      year: dto.year,
      name: dto.name,
      artistId: dto.artistId ?? null,
    };

    return await this.prisma.album.create({
      data: newAlbum,
    });
  }

  async update(id: string, dto: CreateAlbumDto) {
    if (typeof dto.name !== 'string' || typeof dto.year !== 'number') {
      throw new BadRequestException('Invalid data');
    }

    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return await this.prisma.album.update({
      where: { id },
      data: {
        name: dto.name,
        year: dto.year,
        artistId: dto.artistId ?? null,
      },
    });
  }

  async remove(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    await this.prisma.track.updateMany({
      where: { albumId: id },
      data: { albumId: null },
    });

    await this.prisma.album.delete({
      where: { id },
    });

    const allFavs = await this.prisma.favorites.findMany({
      where: { albums: { has: id } },
    });

    for (const fav of allFavs) {
      await this.prisma.favorites.update({
        where: { id: fav.id },
        data: {
          albums: fav.albums.filter((albumId) => albumId !== id),
        },
      });
    }
  }
}
