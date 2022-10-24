import { SearchArea } from '../src/generated/graphql';
import { computeAreaGeohash } from '../src/utils/site';

describe('geohash', () => {
  it('area hash from corners', () => {
    const searchArea: SearchArea = {
      topLeftLat: 48.86751180702597,
      topLeftLon: 2.280191830826772,
      bottomRightLat: 48.849215541375784,
      bottomRightLon: 2.3091167728433737,
    };
    const areaGeohash = computeAreaGeohash(searchArea);

    expect(areaGeohash).toBe('u09');
  });
});
