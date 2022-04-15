import { Tracklist, AlbumContent } from '../src/Tracklist';
import { expect } from 'chai';

const album = new AlbumContent('test/ddzppm.json');
const albumSize = 11;

describe('Tracklist', () => {
  it('parses all songs in an album', () => {
    let t = new Tracklist();
    expect(t.getTrackNum()).eq(0);
    t.add(album);
    expect(t.getTrackNum()).eq(albumSize);
  });

  it('keeps tracks unique', () => {
    let t = new Tracklist();
    t.add(album);
    t.add(album);
    expect(t.getTrackNum()).eq(albumSize);
  })
});