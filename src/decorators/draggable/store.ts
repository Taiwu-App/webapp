import { action, computed, observable } from 'mobx';

import Point2D from '@/models/coordinate-2d';


export interface IDraggableStore {
  containerRef: React.RefObject<HTMLDivElement>;
  isDragging: boolean;
  translate: Point2D;

  onDragEnd: (ev: MouseEvent) => void;
  onDragMoving: (ev: MouseEvent) => void;
  onDragStart: (ev: React.MouseEvent<HTMLElement>) => any;

  dragStartCallback?: (ev: React.MouseEvent<HTMLElement>, store: IDraggableStore) => any;
  dragEndCallback?: (ev: MouseEvent, store: IDraggableStore) => any;
  dragMovingCallback?: (ev: MouseEvent, store: IDraggableStore) => any;
}

/**
 * @member clickedPos will be initialized every time at the drag start
 * @member oldTranslate will be initialized every time at the drag start together with the initPos
 */
export class DraggableStore implements IDraggableStore {
  // private ref: React.RefObject<HTMLDivElement>;
  // life cycle hooks
  public dragStartCallback: undefined | ((ev: React.MouseEvent<HTMLElement>, store: IDraggableStore) => any);
  public dragEndCallback: undefined | ((ev: MouseEvent, store: IDraggableStore) => any);
  public dragMovingCallback: undefined | ((ev: MouseEvent, store: IDraggableStore) => any);

  private clickedPos: Point2D = new Point2D(0, 0);
  private oldTranslate: Point2D = new Point2D(0, 0);
  @observable private mousePos: Point2D = new Point2D(0, 0);
  @computed public get translate(): Point2D {
    const diffVector: Point2D = this.mousePos.minus(this.clickedPos);
    return this.oldTranslate.plus(diffVector);
  }

  @observable private _isDragging: boolean;
  @computed public get isDragging() {
    return this._isDragging;
  }

  constructor(public readonly containerRef: React.RefObject<HTMLDivElement> = { current: null }){}

  @action.bound public onDragStart(ev: React.MouseEvent<HTMLElement>) {
    if (ev.button !== 0) { return; }
    ev.preventDefault();
    ev.stopPropagation();
    const { pageX, pageY } = ev;
    this.oldTranslate = new Point2D(this.translate.x, this.translate.y);
    this.clickedPos = new Point2D(pageX, pageY);
    this.mousePos = new Point2D(pageX, pageY);
    this._isDragging = true;
    window.addEventListener('mousemove', this.onDragMoving, true);
    window.addEventListener('mouseup', this.onDragEnd, true);
    window.addEventListener('wheel', this.onWheel, true);
    if (this.dragStartCallback !== undefined) { this.dragStartCallback(ev, this); }
  }

  @action.bound public onDragEnd(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this._isDragging = false;
    window.removeEventListener('mousemove', this.onDragMoving, true);
    window.removeEventListener('mouseup', this.onDragEnd, true);
    window.removeEventListener('wheel', this.onWheel, true);
    if (this.dragEndCallback !== undefined) { this.dragEndCallback(ev, this); }
  }

  @action.bound public onDragMoving(ev: MouseEvent) {
    this.mousePos = new Point2D(ev.pageX, ev.pageY);
    if (this.dragMovingCallback !== undefined) { this.dragMovingCallback(ev, this); }
  }

  @action.bound public onWheel(ev: WheelEvent) {
    ev.stopPropagation();
    ev.preventDefault();
  }
}