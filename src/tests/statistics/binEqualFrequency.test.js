import { binEqualFrequency } from '../../utils/statistics';

describe('binEqualFreqyency', () => {
  it('should throw if inputArr < nBins', () => {
    expect(() => {
      binEqualFrequency([1], 2);
    }).toThrow();
  });

  it('should return end of bin for length 1, 1 bin', () => {
    const input = [1];
    const nBins = 1;
    const output = [1];
    expect(binEqualFrequency(input, nBins)).toEqual(output);
  });

  it('should return largest number when multiple values for one bin', () => {
    const input = [1, 2];
    const nBins = 1;
    const output = [2];
    expect(binEqualFrequency(input, nBins)).toEqual(output);
  });

  it('should chop evenly for arr of length 2, nbins 2', () => {
    const input = [1, 2];
    const nBins = 2;
    const output = [1, 2];
    expect(binEqualFrequency(input, nBins)).toEqual(output);
  });

  it('should chop evenly for arr of length 4, nbins 2', () => {
    const input = [1, 2, 3, 4];
    const nBins = 2;
    const output = [2, 4];
    expect(binEqualFrequency(input, nBins)).toEqual(output);
  });

  it('should chop evenly for arr of 6 with 0', () => {
    const input = [4, 2, 1, 3, 5, 0];
    const nBins = 2;
    const output = [2, 5];
    expect(binEqualFrequency(input, nBins)).toEqual(output);
  });

  it('should chop 3-2 for array of 5', () => {
    const input = [1, 2, 3, 4, 5];
    const nBins = 2;
    const output = [3, 5];
    expect(binEqualFrequency(input, nBins)).toEqual(output);
  });

  it('should chop evenly for 3 bins', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const nBins = 3;
    const output = [2, 4, 6];
    expect(binEqualFrequency(input, nBins)).toEqual(output);
  });

  it('length 7, 3 bins', () => {
    const input = [1, 2, 3, 4, 5, 6, 7];
    const nBins = 3;
    const output = [2, 5, 7];
    expect(binEqualFrequency(input, nBins)).toEqual(output);
  });
});
