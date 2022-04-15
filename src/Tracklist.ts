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
      let track_name: string = raw_track.name;
      this.feats.set(track_name, raw_track.artists
        .map((artist: any) => artist.name)
        .filter((artist: string) => { return artist !== this.root }));
    });
  }

  resolve(
    current: Set<string>,
    next: Set<string>, 
    closed: Set<string>,
    nodes: NodeEntry[],
    links: LinkEntry[]) 
  {
    current.delete(this.root);
    closed.add(this.root);
    // nodes.push({
    //   id: this.root,
    //   size: 1 // currently treating all artists equally
    // });

    let collaborators: Map<string, number> = new Map();

    this.feats.forEach((feats: string[], _name: string) => {
      feats.forEach((artist) => {
        if (closed.has(artist)) return;

        if (!collaborators.has(artist)) {
          collaborators.set(artist, 1);
          if (!current.has(artist)) {
            next.add(artist);
          }
        } else {
          collaborators.set(artist, collaborators.get(artist)! + 1)
        }
      })  
    })
  }

  // NOTE zeby sie pozbyc producentow na featach mozna by patrzec czy ktorys z wykonawcow nie jest wpisany jako producent
  // TODO check if song is unique by checking name and artists
  getTrackNum(): number {
    return this.feats.size;
  }
}

export { Collaborations, AlbumTracksFromJSON }