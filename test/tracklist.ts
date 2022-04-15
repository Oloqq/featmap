import { Collaborations, AlbumTracksFromJSON } from '../src/Collaborations';
import { expect } from 'chai';
import { LinkEntry, NodeEntry } from '../types/tracklist';

const author = 'Szpaku';
const album = new AlbumTracksFromJSON('test/ddzppm.json');
const albumSize = 11;

const single = new AlbumTracksFromJSON('test/afryka.json'); // the single is also on the album

describe('Tracklist', () => {
  it('parses all songs in an album', () => {
    let t = new Collaborations(author);
    expect(t.getTrackNum()).eq(0);
    t.parseAlbum(album);
    expect(t.getTrackNum()).eq(albumSize);
    expect(t.feats.has('Mateusz'));
  });

  it('recognizes artists properly', () => {
    let c = new Collaborations(author);
    c.parseAlbum(album);
    expect(c.feats.get('Mateusz')).to.deep.eq(['Kubi Producent']);
  })

  it('updates the search state accordingly', () => {
    let closed = new Set<string>(['Kubi Producent']);
    let current = new Set<string>(['Szpaku', 'PSR']);
    let next = new Set<string>(['Worek']);
    let nodes: NodeEntry[] = [];
    let links: LinkEntry[] = [];

    let t = new Collaborations(author);
    t.parseAlbum(album);

    t.resolve(current, next, closed, nodes, links);

    expect(closed).to.contain(author).and.contain('Kubi Producent');
    expect(current).to.contain('PSR').and.have.lengthOf(1);
    expect(next).to.have.lengthOf(6).and.not.contain('Kubi Producent');
    expect(next).not.to.contain('PSR');
  })

  it('updates nodes and links accordingly', () => {
    let closed = new Set<string>(['Kubi Producent']);
    let current = new Set<string>(['Szpaku', 'PSR']);
    let next = new Set<string>(['Worek']);
    let nodes: NodeEntry[] = [];
    let links: LinkEntry[] = [];

    let t = new Collaborations(author);
    t.parseAlbum(album);

    t.resolve(current, next, closed, nodes, links);

    expect(nodes).have.lengthOf(1);
    expect(links).have.lengthOf(7); // Kubi is already closed, so 7
  })

  it('does not include the main artist in the feats', () => {
    let c = new Collaborations(author);
    c.parseAlbum(album);
    c.feats.forEach((feats: string[], name: string) => {
      expect(feats).not.to.contain(author);
    })
  })

  it('fills the last layer of feats', () => {
    let closed = new Set<string>([]);
    let current = new Set<string>(['Szpaku']);
    let next = new Set<string>([]);
    let nodes: NodeEntry[] = [];
    let links: LinkEntry[] = [];

    let t = new Collaborations(author);
    t.parseAlbum(album);

    t.resolve(current, next, closed, nodes, links);
    Collaborations.fillLastLayer(nodes, next, 2);

    expect(nodes).have.lengthOf(9);
    expect(links).have.lengthOf(8);
  })
});