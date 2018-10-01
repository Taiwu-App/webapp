import { IPlaceholder } from './buildings';
import Point2D from './coordinate-2d';
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

export class VillageMap {
  // rows, columns
  public readonly grids: Matrix<IGridInfo>;
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

  public addPlaceholder(position: Point2D, placeholder: IPlaceholder): void {
    this.grids[position.x][position.y].placeholder = placeholder;
  }
}