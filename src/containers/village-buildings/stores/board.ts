import { action, computed, observable } from 'mobx';

import { ISliderStore } from '@/components/slider/store';
import buildings from '@/data/buildings';
import { IBuilding } from '@/models/buildings';
import { IGridInfo, IVillageMap, VillageMap } from '@/models/village-map';
import { IBoardStore } from '../board';


export default class BoardStore implements IBoardStore {
  // board size
  public readonly numberRows = 13;
  public readonly numberColumns = 13;
  
  @observable public readonly sliderStore:ISliderStore;
  @observable private readonly map: IVillageMap;
  private readonly buildings: IBuilding[] = buildings;
  // square grid size, width/height
  private readonly minCellSize = 16;
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
  @computed public get grids(): IGridInfo[][] {
    return this.map.grids.vals;
  }
}