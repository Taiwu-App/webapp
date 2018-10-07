import { IPlaceholder } from '@/models/buildings';

import buildings from './buildings';
import landscapes from './landscapes';

const placeholders: IPlaceholder[] = [...landscapes, ...buildings];
const tags = placeholders.map(p => p.uniqueTag);

function isUnique(array: any[]): number {
  for (let i = 0; i < array.length; i ++) {
    const flag = array.slice(i+1).findIndex(a => a === array[i]) > -1;
    if (flag) { return i; }
  }
  return -1;
}

describe('verify data', () => {
  test('tags should be nonEmpty', () => {
    const idx = tags.findIndex(t => t === '' || t === undefined);
    const msg = `tags for placeholder ${JSON.stringify(placeholders[idx])} is empty`;
    expect({ idx, msg }).toEqual({ idx: -1, msg });
  });

  test('tag should be unique', () => {
    const idx = isUnique(tags);
    const msg = `tag ${tags[idx]} is not unique`;
    expect({ idx, msg }).toEqual({ idx: -1, msg });
  });
});