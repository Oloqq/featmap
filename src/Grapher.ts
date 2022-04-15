import { Spotify } from "./Spotify";
import { Track, Artist } from "../types/spotify";
import { Collaborations } from "../src/Collaborations";
import { LinkEntry, NodeEntry, GraphData } from '../types/graph';
import { log } from './log';

class Grapher {
  spotify: Spotify
  current: Set<Artist> = new Set()
  next:    Set<Artist> = new Set()
  closed:  Set<Artist> = new Set()
  nodes: NodeEntry[] = []
  links: LinkEntry[] = []
  layer: number = 1

  constructor(spotify: Spotify) {
    this.spotify = spotify;
  }

  async graph(id: string): Promise<GraphData> {
    let name = (await this.spotify.getArtist(id)).name;
    let albums = await this.spotify.getAlbumsOfArtist(id);
    let collab = new Collaborations(name);
    for (let album of albums) {
      try {
        let tracks = await this.spotify.getTracksFromAlbum(album.id)
        collab.parseAlbum(tracks);
      } catch (APIError) {
        console.log(`oops ${album.id}`);
      }
      await new Promise(r => setTimeout(r, 100));
    }
    collab.resolve(this.current, this.next, this.closed, this.nodes, this.links);
    
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

