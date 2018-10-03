import { action, computed, observable } from 'mobx';

import Point2D from '@/models/coordinate-2d';


export interface IDraggable {
  isDragging: boolean;
  translate: Point2D;

  onDragEnd: (ev: MouseEvent) => void;
  onDragMoving: (ev: MouseEvent) => void;
  onDragStart: (ev: React.MouseEvent<HTMLElement>) => any;
}

/**
 * @member clickedPos will be initialized every time at the drag start
 * @member oldTranslate will be initialized every time at the drag start together with the initPos
 */
export class DraggableStore implements IDraggable {
  // private ref: React.RefObject<HTMLDivElement>;

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

  @action.bound public onDragStart(ev: React.MouseEvent<HTMLElement>) {
    ev.preventDefault();
    const { pageX, pageY } = ev;
    this.clickedPos = new Point2D(pageX, pageY);
    this.oldTranslate = new Point2D(this.translate.x, this.translate.y);
    this._isDragging = true;
    window.addEventListener('mousemove', this.onDragMoving, true);
    window.addEventListener('mouseup', this.onDragEnd, true);
    window.addEventListener('wheel', this.onWheel, true);
  }

  @action.bound public onDragEnd(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this._isDragging = false;
    window.removeEventListener('mousemove', this.onDragMoving, true);
    window.removeEventListener('mouseup', this.onDragEnd, true);
    window.removeEventListener('wheel', this.onWheel, true);
  }

  @action.bound public onDragMoving(ev: MouseEvent) {
    this.mousePos = new Point2D(ev.pageX, ev.pageY);
  }

  @action.bound public onWheel(ev: WheelEvent) {
    ev.stopPropagation();
    ev.preventDefault();
  }
}