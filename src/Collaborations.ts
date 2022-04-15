import { LinkEntry, NodeEntry } from "../types/tracklist";
import fs from 'fs';

/*
FIXME if artist has several tracks with the same name (e.g. Intro)
only the first intro will be checked
*/
class AlbumTracksFromJSON {
  constructor(path: string) {
    let rawdata = fs.readFileSync(path);
    this.content = JSON.parse(rawdata.toString());
  }

  content: any;
}

class Collaborations {
  readonly root: string;
  feats: Map<string, string[]> = new Map();

  constructor(author: string) {
    this.root = author;
  }

  static fillLastLayer(nodes: NodeEntry[], layer: Set<string>, layerN: number = 0) {
    layer.forEach((node) => {
      nodes.push({
        id: node,
        size: 1, // currently treating all artists equally
        layer: layerN
      });
    });
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
    links: LinkEntry[],
    layer: number = 1)
  {
    current.delete(this.root);
    closed.add(this.root);
    nodes.push({
      id: this.root,
      size: 1, // currently treating all artists equally
      layer
    });

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

    collaborators.forEach((size, colleague) => {
      links.push({
        source: this.root,
        target: colleague,
        size
      })
    })
  }

  // NOTE zeby sie pozbyc producentow na featach mozna by patrzec czy ktorys z wykonawcow nie jest wpisany jako producent
  // TODO check if song is unique by checking name and artists
  getTrackNum(): number {
    return this.feats.size;
  }
}

// const author = 'Szpaku';
// const album = new AlbumTracksFromJSON('test/ddzppm.json');
// const albumSize = 11;

// let closed = new Set<string>(['Kubi Producent']);
// let current = new Set<string>(['Szpaku']);
// let next = new Set<string>(['Worek']);
// let nodes: NodeEntry[] = [];
// let links: LinkEntry[] = [];

// let t = new Collaborations(author);
// t.parseAlbum(album);

// t.resolve(current, next, closed, nodes, links, 1);

// current = next;
// Collaborations.fillLastLayer(nodes, current, 2);
// fs.writeFileSync('public/ddzppm.json', JSON.stringify({
//   nodes, links
// }))

export { Collaborations, AlbumTracksFromJSON }