import { extractId } from '../src/artistId';
import { expect } from 'chai';

describe('Extracting artist id', () => {
    let link = 'https://open.spotify.com/artist/0Wi2fADbhwXlPUWxBmzo99?si=85a1719cac0c4afd';
    let uri = 'spotify:artist:0Wi2fADbhwXlPUWxBmzo99';

    it('from uri', () => {
      expect(extractId.fromUri(uri)).to.eq('0Wi2fADbhwXlPUWxBmzo99');
    });

    it('from link', () => {
      expect(extractId.fromLink(link)).to.eq('0Wi2fADbhwXlPUWxBmzo99');
    });

    it('from any when passed an uri', () => {
      expect(extractId.fromAny(uri)).to.eq('0Wi2fADbhwXlPUWxBmzo99');
    });

    it('from any when passed a link', () => {
      expect(extractId.fromAny(link)).to.eq('0Wi2fADbhwXlPUWxBmzo99');
    });

    it('throws on bad uri format ', () => {
      expect(() => extractId.fromAny('skrrrr:asga:0Wi2fADbhwXlPUWxBmzo99'))
        .to.throw('Bad uri');
    })
});