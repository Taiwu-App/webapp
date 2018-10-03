import { action, computed, observable } from 'mobx';

import SliderStore from '@/components/slider/store';

export default class LocalStore {
  @observable public readonly sliderStore = new SliderStore();
  @computed public get isZoomBarDragging() {
    return this.sliderStore.isDragging;
  }
  @computed public get zoomRatio() {
    return this.sliderStore.ratio;
  }
  // zoom change events
  @action.bound public setRatio(ratio: number) {
    this.sliderStore.setRatio(ratio);
  }
  @action.bound public offsetRatio(offset: number) {
    this.sliderStore.setRatio(this.zoomRatio + offset);
  }
}
