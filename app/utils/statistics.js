export function binEqualFrequency(arr, nbins) {
  if (arr.length < nbins) { throw Error('nbins larger than array length'); }
  if (nbins === 1) { return [Math.max(...arr)]; }

  const div = arr.length / nbins; // 2

  const sortedArr = arr.sort((a, b) => a - b);

  const result = [];

  for (let i = 1; i <= nbins; i += 1) {
    result.push(sortedArr[Math.round(i * div) - 1]);
  }

  return result;
}
