import { AlbumEntity } from 'src/Album/entities/album';
import { ArtistEntity } from 'src/Artist/entities/artist';
import { TrackEntity } from 'src/Track/entities/track';

export interface FavoriteEntity {
  artists: ArtistEntity[];
  albums: AlbumEntity[];
  tracks: TrackEntity[];
}
