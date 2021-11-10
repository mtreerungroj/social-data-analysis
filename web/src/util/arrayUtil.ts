export const topN = (arr: any[], col: string, n: number) => {
  if (n > arr.length) {
    return false;
  }
  return arr
    .slice()
    .sort((a, b) => {
      return b[col] - a[col]
    })
    .slice(0, n);
};