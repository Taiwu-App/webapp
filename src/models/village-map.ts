import { observable } from 'mobx';

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
  grids: Matrix<IGridInfo>;
  setPlaceholderAt: (rowIdx: number, columnIdx: number, placeholder: IPlaceholder | null) => void;
}

/**
 * @class
 * @member rows number of rows
 * @member columns number of columns
 */
export class VillageMap implements IVillageMap {
  // rows, columns
  @observable public readonly grids: Matrix<IGridInfo>;
  /**
   * @constructor
   * @param size [rows, columns]
   */
  constructor(public readonly rows: number, public readonly columns: number) {
    this.grids = new Matrix<IGridInfo>(rows, columns, {
      isAllow: true,
      placeholder: null
    });
  }

  public setPlaceholderAt(rowIdx: number, columnIdx: number, placeholder: IPlaceholder | null): void {
    this.grids.valueAt(rowIdx, columnIdx).placeholder = placeholder;
  }
}