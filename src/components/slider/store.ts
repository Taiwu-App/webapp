import { action, computed, observable } from 'mobx';

export default class SliderStore {
  @observable private _isDragging = false;
  @computed public get isDragging() {
    return this._isDragging;
  }
  // 0 to 100
  @observable private _ratio = 50;
  @computed public get ratio() {
    return this._ratio;
  }
  @computed public get ratioLeft() {
    return this.ratio;
  }
  @computed public get ratioRight() {
    return 100 - this.ratio;
  }

  private _containerRef: React.RefObject<HTMLDivElement>;
  public set containerRef(ref: React.RefObject<HTMLDivElement>) {
    this._containerRef = ref;
  }
  /**
   * bounding box (relative to view port)
   * [x0, y0, x1, y1]
   * (x0, y0) is the bottom left point of the rect
   * (x1, y1) is the top right point of the rect
   * top left of the view port is considered as the origin
   */
  private get boundingBox() {
    if (this._containerRef.current === null) { return [0,0,0,0]; }
    const rect = this._containerRef.current.getBoundingClientRect();
    return [rect.left, rect.top + rect.height, rect.left + rect.width, rect.top];
  }

  @action.bound public setRatio(val: number) {
    if (val > 100)  { val = 100; }
    else if (val < 0) { val = 0; }
    this._ratio = val;
  }

  @action.bound public onDragStart(ev: React.MouseEvent<HTMLDivElement>) {
    ev.preventDefault();
    // zero width
    if (this.boundingBox.filter(v => v > 0).length === 0) { return; }
    this._isDragging = true;
    window.addEventListener('mousemove', this.onDragMove, true);
    window.addEventListener('mouseup', this.onDragEnd, true);
  }

  @action.bound public onDragEnd(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this._isDragging = false;
    window.removeEventListener('mousemove', this.onDragMove, true);
    window.removeEventListener('mouseup', this.onDragEnd, true);
  }

  // slider moving event, value is limited to [0, 100]
  @action.bound public onDragMove(ev: MouseEvent) {
    ev.stopPropagation();
    ev.preventDefault();    
    this.updateValueBasedOnX(ev.clientX);
  }

  @action.bound public onContainerClicked(ev: React.MouseEvent<HTMLDivElement>) {
    this.updateValueBasedOnX(ev.clientX);
  }

  /**
   * calculate state.value based on the clientX
   * then update the state using setState
   * @param clientX clientX of the target position
   */
  @action private updateValueBasedOnX(clientX: number): void {
    const x0 = this.boundingBox[0];
    const x1 = this.boundingBox[2];
    if (Math.abs(x0 - x1) < 1e-8) { return; }
    const value = (clientX - x0) / (x1 - x0) * 100;
    this.setRatio(value);
  }
}
