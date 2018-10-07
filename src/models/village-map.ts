import { action, computed, observable } from 'mobx';

import buildings from '@/assets/data/buildings';
import bindthis from '@/decorators/bindthis';
import { IPlaceholder } from './buildings';
import Matrix from './matrix';

export interface IGridInfo {
  placeholder: IPlaceholder | null;
  isAllow: boolean;
  status: EGridStatus[];
}

export enum EGridStatus {
  hover = 'hover',
  occupied = 'occupied'
}

export interface IVillageMap {
  asBase64: string;
  grids: Matrix<IGridInfo>;
  count: number;

  setPlaceholderAt: (rowIdx: number, columnIdx: number, placeholder: IPlaceholder | null) => void;
  tryRecoveryFromToken: (token: string) => boolean;
}

/**
 * @class
 * @member rows number of rows
 * @member columns number of columns
 */
export class VillageMap implements IVillageMap {
  // rows, columns
  @observable public readonly grids: Matrix<IGridInfo>;
  // number of the buildings (excluding landscape)
  @observable private _count = 0;
  @computed public get count(): number { return this._count; }
  /**
   * @constructor
   * @param size [rows, columns]
   */
  constructor(public readonly rows: number, public readonly columns: number) {
    this.grids = new Matrix<IGridInfo>(rows, columns);
    this.initMatrix();
  }

  @action.bound private initMatrix() {
    this._count = 0;
    for (let i=0; i< this.rows; i++) {
      for (let j=0; j < this.columns; j++) {
        this.grids.setValueAt(i, j, { isAllow: true, placeholder: null, status: [] });
      }
    }
  }

  @action.bound public setPlaceholderAt(rowIdx: number, columnIdx: number, placeholder: IPlaceholder | null): void {
    const oldPlaceholder = this.grids.valueAt(rowIdx, columnIdx).placeholder;
    this.grids.valueAt(rowIdx, columnIdx).placeholder = placeholder;
    if (oldPlaceholder !== null && oldPlaceholder.isArtificial) { this._count--; }
    if (placeholder !== null && placeholder.isArtificial) { this._count++; }
  }

  /**
   * generate base 64 string for saving purpose
   * compressedToken: [number | [a-zA-Z]]
   * number means the next [number] cell is empty
   * letter stands for the uniqueTag of the placeholder
   * for example, [4,c] means [0, 1, 2, 3, 4] are empty (5 in total)
   * the 1D array is row-wise
   */
  public get asBase64(): string {
    const tokenArray: string[] = [];
    this.grids.vals.forEach((row, rIdx) => row.forEach((ele, cIdx) => {
      if (ele.placeholder === null) { tokenArray.push(''); }
      else { tokenArray.push(ele.placeholder.uniqueTag); }
    }));
    tokenArray.push('v1'); // token format version
    const compressed = this.compressTokenArray(tokenArray);
    return btoa(compressed.join(','));
  }

  @action.bound public tryRecoveryFromToken(compressed: string): boolean {
    this.initMatrix();
    const { tokenArray = [], version = [] } = this.parseCompressedToken(compressed);
    if (tokenArray.length === 0 || version.length === 0 ) { return false; }
    const tagMatrix: Matrix<string> | null = this.parseTokenArrayByVersion(tokenArray, version[0]);
    if (tagMatrix === null) { return false; }
    tagMatrix.vals.forEach((row, rIdx) => row.forEach((tag, cIdx) => {
      const [placeholder = null] = buildings.filter(b => b.uniqueTag === tag);
      if (placeholder === null) { return; }
      this.setPlaceholderAt(rIdx, cIdx, placeholder);
    }));
    return true;
  }

  @bindthis private compressTokenArray(tokenArray: string[]) {
    const compressed: any[] = [];
    let isLastEmpty = false;
    tokenArray.forEach(t => {
      if (t === '') {
        if (isLastEmpty) { compressed[compressed.length - 1]++; }
        else {
          compressed.push(0);
          isLastEmpty = true;
        }
      } else {
        compressed.push(t);
        isLastEmpty = false;
      }
    });
    return compressed;
  }

  // return { version, tokenArray } or {} if not correct
  @bindthis private parseCompressedToken(compressed: string) {
    try {
      const token = atob(compressed);
      const tokenArray = token.split(',');
      const version = tokenArray.splice(-1);
      return { version, tokenArray };
    } catch (err) {
      console.error('error when parsing token',err);
      return {};
    }
  }

  // return Matrix<uniqueTag>
  @bindthis public parseTokenArrayByVersion(tokenArray: string[], version: string): Matrix<string> | null {
    switch(version) {
      case 'v1':
        return this.parseTokenArrayV1(tokenArray);
      default:
        return null;
    }
  }

  // return Matrix<uniqueTag>
  @bindthis public parseTokenArrayV1(tokenArray: string[]): Matrix<string> | null {
    const recoveredArray: string[] = [];
    tokenArray.forEach(t => {
      const num = parseInt(t, 10);
      if (isNaN(num)) {
        recoveredArray.push(t);
      } else {
        for (let i = 0; i <= num; i ++) { recoveredArray.push(''); }
      }
    });
    try {
      const numRows = Math.sqrt(recoveredArray.length);
      if (Math.floor(numRows) !== numRows) { throw new Error('recover error! The matrix need to be square'); }
      return new Matrix<string>(numRows, numRows, (i: number, j: number) => recoveredArray[i * numRows + j]);
    } catch(err) {
      console.error(err);
      return null;
    }
  }
}