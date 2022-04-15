import { TrackDict, Artist, LinkEntry, NodeEntry } from "../types/tracklist";
const fs = require('fs');

class AlbumTracksFromJSON {
  constructor(path: string) {
    let rawdata = fs.readFileSync(path);
    this.content = JSON.parse(rawdata);
  }

  content: any;
}

class Collaborations {
  root: string;
  feats: Map<string, string[]> = new Map();

  constructor(author: string) {
    this.root = author;
  }

  parseAlbum(tracks: AlbumTracksFromJSON) {
    tracks.content.forEach((raw_track: any) => {
      let name: string = raw_track.name;
      this.feats.set(name, raw_track.artists
        .map((artist: any) => { artist.name })
        .filter((artist: string) => { return artist !== this.root })
      );
    });
  }

  resolve(
    current: Set<string>,
    next: Set<string>, 
    closed: Set<string>,
    nodes: NodeEntry[],
    links: LinkEntry[]) {

  }

  // NOTE zeby sie pozbyc producentow na featach mozna by patrzec czy ktorys z wykonawcow nie jest wpisany jako producent
  // TODO check if song is unique by checking name and artists
  getTrackNum(): number {
    return this.feats.size;
  }
}

export { Collaborations, AlbumTracksFromJSON }