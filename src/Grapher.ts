import { Spotify } from "./Spotify";
import { Track, Artist } from "../types/spotify";
import { Collaborations } from "../src/Collaborations";
import { LinkEntry, NodeEntry, GraphData } from '../types/graph';
import { log } from './log';

class Grapher {
  spotify: Spotify
  current: Set<string> = new Set()
  next:    Set<string> = new Set()
  closed:  Set<string> = new Set()
  nodes: NodeEntry[] = []
  links: LinkEntry[] = []
  layer: number = 1
  depth: number;
  curLayer = 0;

  static readonly ApiPause = 100;

  constructor(spotify: Spotify) {
    this.spotify = spotify;
    this.depth = 2;
  }

  async graph(id: string): Promise<GraphData> {
    this.current.add(id);

    for (; this.curLayer < this.depth; this.curLayer++) {
      for (let artist of this.current) {
        await this.goThroughArtist(artist);
      }
      this.current = this.next;
      this.next = new Set();
    }
    
    Collaborations.fillLastLayer(this.nodes, this.current, this.depth);
    return {
      nodes: this.nodes,
      links: this.links
    }
  }

  private async goThroughArtist(id: string) {
    let root, albums;
    try {
      root = (await this.spotify.getArtist(id));
      albums = await this.spotify.getAlbumsOfArtist(id);
    } catch (error) {
      return;
    }
    let collab = new Collaborations(root);
    for (let album of albums) {
      try {
        let tracks = await this.spotify.getTracksFromAlbum(album.id)
        collab.parseAlbum(tracks);
      } catch (APIError) {
        log.error(`oops ${album.id}`);
      }
      await new Promise(r => setTimeout(r, Grapher.ApiPause));
    }
    collab.resolve(this.current, this.next, this.closed, this.nodes, this.links, this.curLayer);
  }
}

export { Grapher }

