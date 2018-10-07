import raw, { IRawBookData } from '@/assets/data/books.csv';
import { Book, EBookType } from '@/models/book';
import parseCSV from '@/utils/csv-reader';

export const bookTypeDicts: {[key: string]: EBookType} = {};
Object.keys(EBookType).forEach(k => {
  bookTypeDicts[EBookType[k]] = k as EBookType;
});

function parseOne(line: IRawBookData): Book {
  const { name, level: levelStr = '', type : typeStr = '' } = line;
  const type: EBookType = bookTypeDicts[typeStr];
  const level = parseInt(levelStr, 10);
  if (name === '' || isNaN(level) || level < 0 || type === undefined) {
    // console.log(name, levelStr, level, typeStr, type);
    throw new Error(`input of the book ${JSON.stringify(line)} is not correct!`);
  }
  return new Book(name, level, type);
}

const books = parseCSV<IRawBookData, Book>(raw, parseOne);
// console.log(books);
export default books;