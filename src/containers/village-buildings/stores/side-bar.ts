import { action, computed, observable } from 'mobx';

import buildings from '@/assets/data/buildings';
import SliderStore, { ISliderStore } from '@/components/slider/store';
import { IBuilding } from '@/models/buildings';
import { ISideBarStore } from '../side-bar';

export default class SideBarStore implements ISideBarStore {
  @observable public readonly sliderStore:ISliderStore;

  // buildings and landscapes
  private readonly buildings: IBuilding[] = buildings;
  @computed get filteredBuildings() {
    return [...this.buildings];
  }
  @computed get filteredPlaceholders() {
    return [...this.filteredBuildings];
  }

  constructor() {
    this.sliderStore = new SliderStore();
  }

  @computed public get isZoomBarDragging(): boolean {
    return this.sliderStore.isDragging;
  }
  @computed public get zoomRatio(): number {
    return this.sliderStore.ratio;
  }
  @action.bound public setZoomRatio(ratio: number) {
    this.sliderStore.setRatio(ratio);
  }
  @action.bound public offsetRatio(offset: number) {
    this.sliderStore.setRatio(this.zoomRatio + offset);
  }
}