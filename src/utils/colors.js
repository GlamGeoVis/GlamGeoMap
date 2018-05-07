export const colorForYear = (year) => {
  const range = [1700, 2010];

  const scale = (min, max) =>
    min + ((max - min) * ((year - range[0]) / (range[1] - range[0])));

  const r = scale(172, 0);
  const g = scale(0, 255);
  const b = 255;

  return [Math.round(r), Math.round(g), Math.round(b)];
};

export const buckets = [1700, 1750, 1900, 1850, 1900, 1950, 2000];

export const rgbString = (colorArray) => `rgb(${colorArray[0]},${colorArray[1]},${colorArray[2]})`;

