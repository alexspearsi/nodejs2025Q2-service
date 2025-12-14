import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class FavoriteService {
  private EXAMPLE_UUUID = '123e4567-e89b-12d3-a456-426614174000';

  constructor(private prisma: PrismaService) {}

  async getOrCreateFavorite() {
    try {
      return await this.prisma.favorites.findUniqueOrThrow({
        where: { id: this.EXAMPLE_UUUID },
      });
    } catch {
      return await this.prisma.favorites.create({
        data: {
          id: this.EXAMPLE_UUUID,
          artists: [],
          albums: [],
          tracks: [],
        },
      });
    }
  }

  async findAll() {
    const favs = await this.getOrCreateFavorite();

    const artists =
      favs.artists.length > 0
        ? await this.prisma.artist.findMany({
            where: { id: { in: favs.artists } },
          })
        : [];

    const albums =
      favs.albums.length > 0
        ? await this.prisma.album.findMany({
            where: { id: { in: favs.albums } },
          })
        : [];

    const tracks =
      favs.tracks.length > 0
        ? await this.prisma.track.findMany({
            where: { id: { in: favs.tracks } },
          })
        : [];

    return { artists, albums, tracks };
  }

  async addTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      return false;
    }

    const favs = await this.getOrCreateFavorite();

    if (!favs.tracks.includes(id)) {
      await this.prisma.favorites.update({
        where: { id: this.EXAMPLE_UUUID },
        data: {
          tracks: { push: id },
        },
      });
    }
    return true;
  }

  async removeTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      return false;
    }

    const favs = await this.getOrCreateFavorite();

    if (!favs.tracks.includes(id)) {
      return false;
    }

    await this.prisma.favorites.update({
      where: { id: this.EXAMPLE_UUUID },
      data: {
        tracks: {
          set: favs.tracks.filter((trackId) => trackId !== id),
        },
      },
    });

    return true;
  }

  async addAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      return false;
    }

    const favs = await this.getOrCreateFavorite();

    if (!favs.albums.includes(id)) {
      await this.prisma.favorites.update({
        where: { id: this.EXAMPLE_UUUID },
        data: {
          albums: { push: id },
        },
      });
    }
    return true;
  }

  async removeAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      return false;
    }

    const favs = await this.getOrCreateFavorite();

    if (!favs.albums.includes(id)) {
      return false;
    }

    await this.prisma.favorites.update({
      where: { id: this.EXAMPLE_UUUID },
      data: {
        albums: {
          set: favs.albums.filter((albumId) => albumId !== id),
        },
      },
    });

    return true;
  }

  async addArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      return false;
    }

    const favs = await this.getOrCreateFavorite();

    if (!favs.artists.includes(id)) {
      await this.prisma.favorites.update({
        where: { id: this.EXAMPLE_UUUID },
        data: {
          artists: { push: id },
        },
      });
    }
    return true;
  }

  async removeArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      return false;
    }

    const favs = await this.getOrCreateFavorite();

    if (!favs.artists.includes(id)) {
      return false;
    }

    await this.prisma.favorites.update({
      where: { id: this.EXAMPLE_UUUID },
      data: {
        artists: {
          set: favs.artists.filter((artistId) => artistId !== id),
        },
      },
    });

    return true;
  }
}
