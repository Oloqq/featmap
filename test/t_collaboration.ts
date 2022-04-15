import { Collaborations } from '../src/Collaborations';
import { expect } from 'chai';
import { LinkEntry, NodeEntry } from '../types/graph';
import { Track, Artist } from "../types/spotify";
import fs from 'fs';

// these are not actually correct ids
const Szpaku = {
  name: "Szpaku",
  id: "0Wi2fADbhwXlPUWxBmzo99"
};
const Kubi = {
  name: 'Kubi Producent',
  id: '0WDJa0qnagyOnMaiD26wht'
}
const PSR = {
  name: 'PSR',
  id: '58HrJf2URKRHTdaB28FcLh'
}
const Worek = {
  name:'Worek',
  id:'00o5eWNk5MqreQLbngsikb'
}

const artistLookup = new Map<string, Artist>();
for (let i of [Szpaku, Kubi, PSR, Worek]) {
  artistLookup.set(i.id, i);
}
artistLookup.set("5bjlaptdRxdTCicOIX7k2P", {
  name:'Worek5bjlaptdRxdTCicOIX7k2P',
  id:'5bjlaptdRxdTCicOIX7k2P'
});
artistLookup.set("0suD5l3wWM0EdjkhrBfUxk", {
  name:'Worek0suD5l3wWM0EdjkhrBfUxk',
  id:'0suD5l3wWM0EdjkhrBfUxk'
});
artistLookup.set("4nRJJWVfbPAULHZl7VYVE8", {
  name:'Worek4nRJJWVfbPAULHZl7VYVE8',
  id:'4nRJJWVfbPAULHZl7VYVE8'
});
artistLookup.set("5GvwPBszaFVYwZS9eMX6vX", {
  name:'Worek5GvwPBszaFVYwZS9eMX6vX',
  id:'5GvwPBszaFVYwZS9eMX6vX'
});
artistLookup.set("1oV1ajXGlrUCygNTDn8Ez4", {
  name:'1oV1ajXGlrUCygNTDn8Ez4asda',
  id:'1oV1ajXGlrUCygNTDn8Ez4'
});




const album = JSON.parse(fs.readFileSync('test/ddzppm.json').toString());
const albumSize = 11;

const single = JSON.parse(fs.readFileSync('test/afryka.json').toString()); // the single is also on the album

describe('Tracklist', () => {

  it('parses all songs in an album', () => {
    let t = new Collaborations(Szpaku);
    expect(t.getTrackNum()).eq(0);
    t.parseAlbum(album);
    expect(t.getTrackNum()).eq(albumSize);
    expect(t.feats.has('Mateusz'));
  });

  it('recognizes artists properly', () => {
    let c = new Collaborations(Szpaku);
    c.parseAlbum(album);
    expect(c.feats.get('Mateusz')).to.deep.eq([Kubi]);
  })

  it('updates the search state accordingly', () => {
    let closed = new Set<string>([Kubi.id]);
    let current = new Set<string>([Szpaku.id, PSR.id]);
    let next = new Set<string>([Worek.id]);
    let nodes: NodeEntry[] = [];
    let links: LinkEntry[] = [];

    let t = new Collaborations(Szpaku);
    t.parseAlbum(album);

    t.resolve(current, next, closed, nodes, links, 1);

    expect(closed).to.contain(Szpaku.id).and.contain(Kubi.id);
    expect(current).to.contain(PSR.id).and.have.lengthOf(1);
    expect(next).to.have.lengthOf(6).and.not.contain(Kubi.id);
    expect(next).not.to.contain(PSR.id);
  })

  it('updates nodes and links accordingly', () => {
    let closed = new Set<string>([Kubi.id]);
    let current = new Set<string>([Szpaku.id, PSR.id]);
    let next = new Set<string>([Worek.id]);
    let nodes: NodeEntry[] = [];
    let links: LinkEntry[] = [];

    let t = new Collaborations(Szpaku);
    t.parseAlbum(album);

    t.resolve(current, next, closed, nodes, links, 1);

    expect(nodes).have.lengthOf(1);
    expect(links).have.lengthOf(7); // Kubi is already closed, so 7
  })

  it('does not include the main artist in the feats', () => {
    let c = new Collaborations(Szpaku);
    c.parseAlbum(album);
    c.feats.forEach((feats: Artist[], name: string) => {
      expect(feats).not.to.contain(Szpaku);
    })
  })

  it('fills the last layer of feats', () => {
    let closed = new Set<string>([]);
    let current = new Set<string>([Szpaku.name]);
    let next = new Set<string>([]);
    let nodes: NodeEntry[] = [];
    let links: LinkEntry[] = [];

    let t = new Collaborations(Szpaku);
    t.parseAlbum(album);

    t.resolve(current, next, closed, nodes, links, 1);
    Collaborations.fillLastLayer(nodes, next, 2);

    expect(nodes).have.lengthOf(9);
    expect(links).have.lengthOf(8);
  })
});