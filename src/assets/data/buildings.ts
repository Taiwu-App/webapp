import raw, { IRawBuilding } from '@/assets/data/buildings.csv';
import { Book } from '@/models/book';
import { Building, ELimitation, EUsages, ILimitation } from '@/models/buildings';
import parseCSV from '@/utils/csv-reader';
import books from './books';

/* tslint:disable:object-literal-sort-keys */
const usageDict: {[key: string]: EUsages} = {
  '钱': EUsages.gold,
  '威望': EUsages.fame,
  '人': EUsages.pop,
  '学习': EUsages.study,
  '修习': EUsages.practice,
  '突破': EUsages.breakthrough,
  '制品': EUsages.production,
  '造诣': EUsages.attainments,
  '材料': EUsages.materials,
  '其他': EUsages.others
};

const limitationTypeDict: {[key: string]: ELimitation} = {
  'n': ELimitation.neighbor,
  'u': ELimitation.unique
};
/* tslint:enable:object-literal-sort-keys */
function findBook(bookName: string): Book | undefined {
  if (bookName === '') { return undefined; }
  const filtered = books.filter(b => b.name === bookName);
  if (filtered.length < 1) {
    throw new Error(`book name ${bookName} not found`);
  }
  return filtered[0];
}

function parseLimitations(limitStr: string): ILimitation[] {
  if (limitStr === '') { return []; }
  const limits = limitStr.split('&');
  return limits.map(l => {
    const type = limitationTypeDict[l.charAt(0)];
    if (type === undefined) {
      throw new Error(`limitation type ${l} not found`);
    }
    const name = l.slice(1);
    return { type: limitationTypeDict[type], requiredName: name };
  });
}

function parseUsages(usageStr: string): EUsages[] {
  if (usageStr === '') { return []; }
  const usages = usageStr.split('&');
  return usages.map(u => {
    const usage = usageDict[u];
    if (usage === undefined) {
      throw new Error(`usage type ${u} not found`);
    }
    return usage;
  });
}

function parseOne(line: IRawBuilding): Building {
  const { tag, icon, name, usages: usageStr, limits: limitStr, book: bookName } = line;
  const book: Book | undefined = findBook(bookName);
  const limitations: ILimitation[] = parseLimitations(limitStr);
  const usages: EUsages[] = parseUsages(usageStr);
  return new Building(icon, name, tag, { book, usages, limitations });
}

const buildings = parseCSV<IRawBuilding, Building>(raw, parseOne);
export default buildings;