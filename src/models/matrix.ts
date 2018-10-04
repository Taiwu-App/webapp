import { observable } from 'mobx';

import bindthis from '@/decorators/bindthis';

export default class Matrix<T> {
  @observable public readonly vals: T[][];

  constructor(public readonly rows: number, public readonly columns: number,
    initialValue: any | ((i: number, j: number) => any) = null) {
    this.vals = [];
    for (let i = 0; i < rows; i++) {
      this.vals.push([]);
      for (let j = 0; j < columns; j++) {
        if (this.isFunction(initialValue)) {
          this.vals[i].push(initialValue(i, j));
        } else {
          this.vals[i].push({...initialValue});
        }
      }
    }
  }

  @bindthis public valueAt(rowIdx: number, columnIdx: number): T {
    if (rowIdx >= this.vals.length || columnIdx >= this.vals[0].length) {
      throw new Error('matrix index out of boundary');
    }
    return this.vals[rowIdx][columnIdx];
  }

  private isFunction(functionToCheck: any): boolean {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  }
}