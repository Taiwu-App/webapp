import { action, computed, observable } from 'mobx';

import { ISliderStore } from '@/components/slider/store';
import bindthis from '@/decorators/bindthis';
import { IPlaceholder } from '@/models/buildings';
import Point2D from '@/models/coordinate-2d';
import { IGridInfo, IVillageMap, VillageMap } from '@/models/village-map';
import { IBoardStore } from '../board';

export interface IPlaceholderOnBoard extends IPlaceholder {
  rowIdx?: number;
  columnIdx?: number;
}

export default class BoardStore implements IBoardStore {
  // board size
  public readonly numberRows = 13;
  public readonly numberColumns = 13;
  // ref to the board table, will be assigned after the table is mounted
  public readonly tableRef: React.RefObject<HTMLTableElement>;
  
  @observable public readonly sliderStore:ISliderStore;

  @observable private readonly map: IVillageMap;
  // square grid size, width/height
  private readonly minCellSize = 32;
  private readonly maxCellSize = 256;

  constructor(sliderStore: ISliderStore) {
    this.sliderStore = sliderStore;
    this.map = new VillageMap(this.numberRows, this.numberColumns);
  }

  @computed public get zoomRatio(): number {
    return this.sliderStore.ratio;
  }
  @computed public get cellSize(): number {
    return (this.maxCellSize - this.minCellSize) * this.zoomRatio / 100 + this.minCellSize;
  }
  @action.bound public offsetRatio(offset: number) {
    this.sliderStore.setRatio(this.zoomRatio + offset);
  }

  @computed public get boardWidth(): number {
    return this.cellSize * this.numberColumns;
  }
  @computed public get boardHeight(): number {
    return this.cellSize * this.numberRows;
  }
  // top-left point, coordinate are corresponding to ClientX, ClientY
  @computed private get boardPosition(): Point2D {
    const box = this.tableRef.current!.children[0].getBoundingClientRect();
    return new Point2D(box.left, box.top);
  }
  @computed public get grids(): IGridInfo[][] {
    return this.map.grids.vals;
  }

  @bindthis public handleDrop(position: Point2D, props: IPlaceholderOnBoard) {
    const [rowIdx, columnIdx] = this.getCellIdxByCoords(position);
    if (rowIdx < this.numberRows && columnIdx < this.numberColumns) {
      this.replacePlaceholderAt(rowIdx, columnIdx, props);
    } else {
      this.resetDragging(props);
    }
  }
  // return [rowIdx, columnIdx]
  @bindthis private getCellIdxByCoords(position: Point2D): [number, number] {
    const offset = position.minus(this.boardPosition);
    const columnIdx = Math.floor(offset.x / this.cellSize);
    const rowIdx = Math.floor(offset.y / this.cellSize);
    return [rowIdx, columnIdx];
  }
  @action.bound private replacePlaceholderAt(rowIdx: number, columnIdx: number, props: IPlaceholderOnBoard) {
    this.map.setPlaceholderAt(rowIdx, columnIdx, props);
    const { rowIdx: oldRowIdx = -1, columnIdx: oldColumnIdx = -1 } = props;
    if (oldRowIdx > -1 && oldColumnIdx > -1) {
      this.map.setPlaceholderAt(oldRowIdx, oldColumnIdx, null);
    }
    // console.log(props);
    // this.map.grids = [...this.map.grids];
    // console.log(this.map.grids);
  }
  @action.bound private resetDragging(props: IPlaceholderOnBoard) {
    if (props.rowIdx === undefined || props.columnIdx === undefined) { return; }
  }
}