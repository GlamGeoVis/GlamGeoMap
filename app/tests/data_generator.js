export const booksPerYear = (startYear, endYear, maxBooks = 100) => {
  const data = [];
  for (let i = startYear; i < endYear; i += 1) {
    data.push({
      year: i,
      nBooks: Math.round(Math.random() * maxBooks),
    });
  }
  return data;
};
