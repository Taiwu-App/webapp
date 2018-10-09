import { action, computed, observable } from 'mobx';

import { ISliderStore } from '@/components/slider/store';
import bindthis from '@/decorators/bindthis';
import { IPlaceholder } from '@/models/buildings';
import Point2D from '@/models/coordinate-2d';
import { IGridInfo, IVillageMap, VillageMap } from '@/models/village-map';
import { IBoardStore } from '../board';

export default class BoardStore implements IBoardStore {
  // board size
  public readonly numberRows = 13;
  public readonly numberColumns = 13;
  // ref to the board table, will be assigned after the table is mounted
  public readonly tableRef: React.RefObject<HTMLTableElement>;
  
  @observable public readonly sliderStore:ISliderStore;

  @observable public readonly map: IVillageMap;
  // square grid size, width/height
  private readonly minCellSize = 32;
  private readonly maxCellSize = 256;

  constructor(sliderStore: ISliderStore) {
    this.sliderStore = sliderStore;
    this.map = new VillageMap(this.numberRows, this.numberColumns);
  }

  @computed public get buildingCount(): number {
    return this.map.count;
  }

  @computed public get zoomRatio(): number {
    return this.sliderStore.ratio;
  }
  @computed public get cellSize(): number {
    return (this.maxCellSize - this.minCellSize) * this.zoomRatio / 100 + this.minCellSize;
  }
  @computed public get className(): string {
    if (this.cellSize < 40) { return 'small'; }
    else if (this.cellSize < 100) { return 'medium'; }
    else { return 'large'; }
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
  // top-left point of the table, coordinates are corresponding to ClientX, ClientY
  @computed private get boardPosition(): Point2D {
    const box = this.tableRef.current!.children[0].getBoundingClientRect();
    return new Point2D(box.left, box.top);
  }
  @computed public get grids(): IGridInfo[][] {
    return this.map.grids.vals;
  }

  /**
   * @param position Client position
   * @param props if props is null, this function will do nothing
   */
  @bindthis public handleDrop(position: Point2D, props: IPlaceholder | null) {
    if (props === null) { return; }
    if (!this.isInVisibleArea(position)) { return this.resetDragging(props); }
    const [rowIdx, columnIdx] = this.getCellIdxByCoords(position);
    if (rowIdx < this.numberRows && columnIdx < this.numberColumns && rowIdx > -1 && columnIdx > -1) {
      this.replacePlaceholderAt(props, rowIdx, columnIdx);
    } else {
      this.replacePlaceholderAt(props, props.rowIdx, props.columnIdx);
    }
  }
  // return [rowIdx, columnIdx]
  @bindthis private getCellIdxByCoords(position: Point2D): [number, number] {
    const offset = position.minus(this.boardPosition);
    const columnIdx = Math.floor(offset.x / this.cellSize);
    const rowIdx = Math.floor(offset.y / this.cellSize);
    return [rowIdx, columnIdx];
  }
  @action.bound private replacePlaceholderAt(props: IPlaceholder, rowIdx?: number, columnIdx?: number) {
    const { rowIdx: oldRowIdx = -1, columnIdx: oldColumnIdx = -1 } = props;
    if (oldRowIdx > -1 && oldColumnIdx > -1) {
      this.map.setPlaceholderAt(oldRowIdx, oldColumnIdx, null);
    }
    if (rowIdx !== undefined && columnIdx !== undefined) {
      this.map.setPlaceholderAt(rowIdx, columnIdx, props);
    }
  }
  @action.bound public removePlaceholderAt(rowIdx: number, columnIdx: number) {
    if (rowIdx < 0 || columnIdx < 0) { return; }
    this.map.setPlaceholderAt(rowIdx, columnIdx, null);
  }
  @action.bound public resetDragging(props: IPlaceholder) {
    if (props.rowIdx === undefined || props.columnIdx === undefined) { return; }
    this.replacePlaceholderAt(props, props.rowIdx, props.columnIdx);
  }
  /**
   * is the position in the visible area (the board-frame)
   * @param position (ClientX, ClientY)
   */
  private isInVisibleArea(position: Point2D): boolean {
    const visibleContainer = this.tableRef.current!.parentElement!.parentElement!;
    const box = visibleContainer.getBoundingClientRect();
    return (position.x > box.left && position.x < box.left + box.width &&
      position.y > box.top && position.y < box.top + box.height);
  }

  @action.bound public recoverFromToken(token: string): boolean {
    return this.map.tryRecoveryFromToken(token);
  }
}