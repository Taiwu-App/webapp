import raw, { IRawLandscape } from '@/assets/data/landscapes.csv';
import { Landscape } from '@/models/buildings';
import parseCSV from '@/utils/csv-reader';

function parseOne(line: IRawLandscape): Landscape {
  const { tag, icon, name, rarity } = line;
  return new Landscape(icon, name, tag, { rarity });
}

const landscapes = parseCSV<IRawLandscape, Landscape>(raw, parseOne);
// console.log(landscapes);
export default landscapes;
