export const colorForYear = (year) => {
  if (year < 1750) { return [191, 211, 230]; }
  if (year < 1800) { return [158, 188, 218]; }
  if (year < 1840) { return [140, 150, 198]; }
  if (year < 1890) { return [136, 86, 167]; }
  return [129, 15, 124];
};

export const buckets = [1700, 1775, 1820, 1870, 1920];

export const rgbString = (colorArray) => `rgb(${colorArray[0]},${colorArray[1]},${colorArray[2]})`;
