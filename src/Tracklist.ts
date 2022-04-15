import { TrackDict, Artist } from "../types/tracklist";
const fs = require('fs');

class AlbumContent {
  constructor(path: string) {
    let rawdata = fs.readFileSync(path);
    this.content = JSON.parse(rawdata);
  }

  content: any;
}

class Track {
  name: string;
  artists: Artist[] = [];

  constructor(data: any) {
    this.name = data.name;
    this.artists = data.artists.map((artist: any) => { artist.name })
  }
}

class Tracklist {
  tracks: TrackDict = {};

  constructor() {
  }

  add(tracks: AlbumContent) {
    tracks.content.forEach((raw_track: any) => {
      let id = raw_track.id;
      if (!(id in tracks)) {
        let track = new Track(raw_track);

        this.tracks[id] = track;
      }
    });
  }

  // NOTE zeby sie pozbyc producentow na featach mozna by patrzec czy ktorys z wykonawcow nie jest wpisany jako producent
  // TODO check if song is unique by checking name and artists
  getTrackNum(): number {
    return Object.keys(this.tracks).length;
  }
}

export { Tracklist, AlbumContent }