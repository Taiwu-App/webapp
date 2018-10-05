import { action, computed, observable } from 'mobx';

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
  count: number;
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
  // number of the buildings (excluding landscape)
  @observable private _count = 0;
  @computed public get count(): number { return this._count; }
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

  @action public setPlaceholderAt(rowIdx: number, columnIdx: number, placeholder: IPlaceholder | null): void {
    const oldPlaceholder = this.grids.valueAt(rowIdx, columnIdx).placeholder;
    this.grids.valueAt(rowIdx, columnIdx).placeholder = placeholder;
    if (oldPlaceholder !== null && oldPlaceholder.isArtificial) { this._count--; }
    if (placeholder !== null && placeholder.isArtificial) { this._count++; }
  }
}