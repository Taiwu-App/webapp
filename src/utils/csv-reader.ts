function isNonEmpty<R>(row: R) {
  return Object.keys(row).findIndex(k => row[k] !== '') >= 0;
}
export default function parseCSV<R, O>(data: R[], parser: (raw:R) => O): O[] {
  return data.filter(isNonEmpty).map(parser);
}