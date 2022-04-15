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

  constructor(spotify: Spotify) {
    this.spotify = spotify;
  }

  async graph(id: string): Promise<GraphData> {
    let root = (await this.spotify.getArtist(id));
    let albums = await this.spotify.getAlbumsOfArtist(id);
    let collab = new Collaborations(root);
    for (let album of albums) {
      try {
        let tracks = await this.spotify.getTracksFromAlbum(album.id)
        collab.parseAlbum(tracks);
      } catch (APIError) {
        log.error(`oops ${album.id}`);
      }
      await new Promise(r => setTimeout(r, 100));
    }
    collab.resolve(this.current, this.next, this.closed, this.nodes, this.links, 1);
    
    Collaborations.fillLastLayer(this.nodes, this.next, 2);
    return {
      nodes: this.nodes,
      links: this.links
    }
  }

  private async goThroughArtist(id: string) {

  }
}

export { Grapher }

