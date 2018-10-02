import { action, computed, observable } from 'mobx';

class BuildPlanning {
  @observable public cellSizeZoomRatio = 30;

  private minCellSize = 16;
  private maxCellSize = 128;

  @computed public get cellSize() {
    return (this.maxCellSize - this.minCellSize) * this.cellSizeZoomRatio / 100 + this.minCellSize;
  }

  // zoom change events
  @action.bound public setRatio(ratio: number) {
    this.cellSizeZoomRatio = ratio;
  }
  @action.bound public offsetRatio(offset: number) {
    let ratio = this.cellSizeZoomRatio + offset;
    if (ratio > 100)  { ratio = 100; }
    else if (ratio < 0) { ratio = 0; }
    this.setRatio(ratio);
  }
  // event handler
  @action.bound public handleZoomInClicked() {
    this.offsetRatio(10);
  }
  @action.bound public HandleZoomOutClicked() {
    this.offsetRatio(-10);
  }
}

export default new BuildPlanning();
