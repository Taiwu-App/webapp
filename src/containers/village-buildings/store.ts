import { action, computed, observable } from 'mobx';

import SliderStore, { ISliderStore } from '@/components/slider/store';
import { IGridInfo, IVillageMap, VillageMap } from '@/models/village-map';
import { IBoardStore } from './board';
import { ISideBarStore } from './side-bar';

class BuildPlanning implements ISideBarStore, IBoardStore {
  // board size
  public readonly numberRows = 13;
  public readonly numberColumns = 13;

  @observable public readonly sliderStore:ISliderStore;
  @observable private readonly map: IVillageMap;

  // square grid size, width/height
  private readonly minCellSize = 16;
  private readonly maxCellSize = 256;

  constructor() {
    this.sliderStore = new SliderStore();
    this.map = new VillageMap(this.numberRows, this.numberColumns);
  }

  // zoom part begin
  @computed public get isZoomBarDragging(): boolean {
    return this.sliderStore.isDragging;
  }
  @computed public get zoomRatio(): number {
    return this.sliderStore.ratio;
  }
  @computed public get cellSize(): number {
    return (this.maxCellSize - this.minCellSize) * this.zoomRatio / 100 + this.minCellSize;
  }
  // zoom change events
  @action.bound public setZoomRatio(ratio: number) {
    this.sliderStore.setRatio(ratio);
  }
  @action.bound public offsetRatio(offset: number) {
    this.sliderStore.setRatio(this.zoomRatio + offset);
  }
  // zoom part end

  // board part begin
  @computed public get boardWidth(): number {
    return this.cellSize * this.numberColumns;
  }
  @computed public get boardHeight(): number {
    return this.cellSize * this.numberRows;
  }
  @computed public get grids(): IGridInfo[][] {
    return this.map.grids.vals;
  }
  // board part end
}

export default new BuildPlanning();
