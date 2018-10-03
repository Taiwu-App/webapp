import { computed, observable } from 'mobx';

import SideBarStore from './side-bar/store';

class BuildPlanning {
  @observable public readonly sideBarStore = new SideBarStore();

  // square grid size, width/height
  private minCellSize = 16;
  private maxCellSize = 128;

  @computed public get cellSizeZoomRatio() {
    return this.sideBarStore.zoomRatio;
  }
  public setCellSizeZoomRatio(ratio: number) {
    this.sideBarStore.setRatio(ratio);
  }
  @computed public get cellSize() {
    return (this.maxCellSize - this.minCellSize) * this.cellSizeZoomRatio / 100 + this.minCellSize;
  }
}

export default new BuildPlanning();
