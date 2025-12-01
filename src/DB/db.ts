import { AlbumEntity } from 'src/Album/entities/album';
import { ArtistEntity } from 'src/Artist/entities/artist';
import { TrackEntity } from 'src/Track/entities/track';
import { UserEntity } from 'src/User/entities/user';

type InMemoryDB = {
  users: UserEntity[];
  artists: ArtistEntity[];
  albums: AlbumEntity[];
  tracks: TrackEntity[];
  favorites: {
    artists: ArtistEntity[];
    albums: AlbumEntity[];
    tracks: TrackEntity[];
  };
};

export const db: InMemoryDB = {
  users: [],
  artists: [],
  albums: [],
  tracks: [],
  favorites: {
    artists: [],
    albums: [],
    tracks: [],
  },
};
