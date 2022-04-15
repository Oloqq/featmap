import { LinkEntry, NodeEntry } from "../types/graph";
import { Track, Artist } from "../types/spotify";

/*
FIXME if artist has several tracks with the same name (e.g. Intro)
only the first intro will be checked
*/

class Collaborations {
  readonly root: Artist;
  feats: Map<string, Artist[]> = new Map(); // song to artists

  constructor(author: Artist) {
    this.root = author;
  }

  static fillLastLayer(
    nodes: NodeEntry[],
    layer: Set<string>,
    layerN: number = 0,
    artistLookup: Map<string, Artist>) 
  {
    console.log(layer)
    throw 'bruh';
    // layer.forEach((id) => {
    //   nodes.push({
    //     id: artistLookup.get(id)?.name,
    //     size: 1, // currently treating all artists equally
    //     layer: layerN
    //   });
    // });
  }

  parseAlbum(tracks: Track[]) {
    tracks.forEach((raw_track: any) => {
      let track_name: string = raw_track.name;
      this.feats.set(track_name, raw_track.artists
        .map((artist: Artist) => {
          return {name: artist.name, id: artist.id}
        })
        .filter((artist: Artist) => { return artist.id !== this.root.id }));
    });
  }

  resolve(
    current: Set<string>,
    next: Set<string>, 
    closed: Set<string>,
    nodes: NodeEntry[],
    links: LinkEntry[],
    layer: number = 1,
    artistLookup: Map<string, Artist>)
  {
    current.delete(this.root.id);
    closed.add(this.root.id);
    nodes.push({
      id: this.root.id,
      size: 1, // currently treating all artists equally
      layer
    });

    let collaborators: Map<string, number> = new Map();

    this.feats.forEach((feats: Artist[], _name: string) => {
      feats.forEach((artist) => {
        if (closed.has(artist.id)) return;

        if (!collaborators.has(artist.id)) {
          collaborators.set(artist.id, 1);
          if (!current.has(artist.id)) {
            next.add(artist.id);
          }
        } else {
          collaborators.set(artist.id, collaborators.get(artist.name)! + 1)
        }
      })  
    })

    collaborators.forEach((size, colleague) => {
      links.push({
        source: this.root.name,
        target: colleague, //FIXME use lookup
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

export { Collaborations }