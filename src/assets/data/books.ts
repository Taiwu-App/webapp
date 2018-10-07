import raw, { IRawBookData } from '@/assets/data/books.csv';
import { Book, EBookType } from '@/models/book';
import parseCSV from '@/utils/csv-reader';

/* tslint:disable:object-literal-sort-keys */
const bookTypeDict: {[name: string]: EBookType} = {
  '品鉴': EBookType.evaluation,
  '音律': EBookType.music,
  '弈棋': EBookType.go,
  '道学': EBookType.confucian,
  '佛学': EBookType.buddhism,  
  '医术': EBookType.medicine,
  '木工': EBookType.woodCarving,
  '毒术': EBookType.poison,
  '锻造': EBookType.forging,
  '文学': EBookType.literature,
  '数术': EBookType.math,
  '厨艺': EBookType.cooking,
  '巧匠': EBookType.jadeCarving,
  '绘画': EBookType.painting,
  '杂学': EBookType.mixed,
  '刺绣': EBookType.clothing
};
/* tslint:enable:object-literal-sort-keys */
function parseOne(line: IRawBookData): Book {
  const { name, level: levelStr = '', type : typeStr = '' } = line;
  const type: EBookType = bookTypeDict[typeStr];
  const level = parseInt(levelStr, 10);
  if (name === '' || isNaN(level) || level < 0 || type === undefined) {
    console.log(name, levelStr, level, typeStr, type);
    throw new Error(`input of the book ${JSON.stringify(line)} is not correct!`);
  }
  return new Book(name, level, type);
}

const books = parseCSV<IRawBookData, Book>(raw, parseOne);
// console.log(books);
export default books;