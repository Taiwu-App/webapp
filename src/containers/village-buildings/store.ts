import { action, computed, observable } from 'mobx';
import * as ReactDOM from 'react-dom';

import SliderStore, { ISliderStore } from '@/components/slider/store';
import buildings from '@/data/buildings';
import { IDraggable as IDraggableStore } from '@/decorators/draggable/store';
import { IBuilding } from '@/models/buildings';
import { IGridInfo, IVillageMap, VillageMap } from '@/models/village-map';
import { IBoardStore } from './board';
import { DraggablePlaceholder } from './placeholder';
import { ISideBarStore } from './side-bar';

class BuildPlanning implements ISideBarStore, IBoardStore {
  // board size
  public readonly numberRows = 13;
  public readonly numberColumns = 13;

  @observable public readonly sliderStore:ISliderStore;
  @observable private readonly map: IVillageMap;

  // buildings and landscapes
  private readonly buildings: IBuilding[] = buildings;
  @computed get filteredBuildings() {
    return [...this.buildings];
  }
  @computed get filteredPlaceholders() {
    return [...this.filteredBuildings];
  }

  // square grid size, width/height
  private readonly minCellSize = 16;
  private readonly maxCellSize = 256;

  // private readonly placeholderDragStore: IDraggable;

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

  // placeholder part begin
  @action.bound public placeholderDraggingBegin(ev: React.MouseEvent<HTMLElement>, ref: React.RefObject<DraggablePlaceholder>) {
    if (ref.current === null) {
      throw new Error('ref not found');
    }    
    const store = (ref.current as any).store as IDraggableStore;
    store.onDragStart(ev);
    window.addEventListener('mouseup', this.placeholderDragEnd, true);
  }
  @action.bound public placeholderDragEnd(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    window.removeEventListener('mouseup', this.placeholderDragEnd, true);
    if (ev.target === null) { return; }
    const target = ev.target as HTMLLIElement;
    const container = target.parentElement!.parentElement!;
    ReactDOM.unmountComponentAtNode(container);
    container.parentElement!.removeChild(container);
  }
  // placeholder part end
}

export default new BuildPlanning();
