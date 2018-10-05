import { action, computed, observable } from 'mobx';
import * as React from 'react';

import Point2D from '@/models/coordinate-2d';
import bindthis from '../bindthis';

export type UnionMouseEvent = MouseEvent | React.MouseEvent<HTMLElement>;

export interface IDraggableStore {
  containerRef: React.RefObject<HTMLDivElement>;
  isDragging: boolean;
  translate: Point2D;

  handleMouseDown: (ev: React.MouseEvent<HTMLElement>) => any;

  endDrag: (ev: UnionMouseEvent) => void;
  onDragMoving: (ev: UnionMouseEvent) => void;
  startDrag: (ev: UnionMouseEvent) => any;

  dragStartCallback?: (ev: UnionMouseEvent, store: IDraggableStore) => any;
  dragEndCallback?: (ev: UnionMouseEvent, store: IDraggableStore) => any;
  dragMovingCallback?: (ev: UnionMouseEvent, store: IDraggableStore) => any;
}

/**
 * @member clickedPos will be initialized every time at the drag start
 * @member oldTranslate will be initialized every time at the drag start together with the initPos
 */
export class DraggableStore implements IDraggableStore {
  // private ref: React.RefObject<HTMLDivElement>;
  // life cycle hooks
  public dragStartCallback?: (ev: UnionMouseEvent, store: IDraggableStore) => any;
  public dragEndCallback?: (ev: UnionMouseEvent, store: IDraggableStore) => any;
  public dragMovingCallback?: (ev: UnionMouseEvent, store: IDraggableStore) => any;

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

  @bindthis public handleMouseDown(ev: React.MouseEvent<HTMLElement>) {
    if (ev.button !== 0) { return; }
    this.startDrag(ev);
  }
  @action.bound public startDrag(ev: UnionMouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this.oldTranslate = new Point2D(this.translate.x, this.translate.y);
    const position = new Point2D(ev.pageX, ev.pageY);
    this.clickedPos = position;
    this.mousePos = position.clone();
    this._isDragging = true;
    window.addEventListener('mousemove', this.onDragMoving, true);
    window.addEventListener('mouseup', this.handleMouseUp, true);
    window.addEventListener('wheel', this.onWheel, true);
    if (this.dragStartCallback !== undefined) { this.dragStartCallback(ev, this); }
  }

  @bindthis public handleMouseUp(ev: MouseEvent) {
    if (ev.button !== 0) { return; }
    this.endDrag(ev);
  }
  @action.bound public endDrag(ev: UnionMouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this._isDragging = false;
    window.removeEventListener('mousemove', this.onDragMoving, true);
    window.removeEventListener('mouseup', this.handleMouseUp, true);
    window.removeEventListener('wheel', this.onWheel, true);
    if (this.dragEndCallback !== undefined) { this.dragEndCallback(ev, this); }
  }

  @action.bound public onDragMoving(ev: UnionMouseEvent) {
    this.mousePos = new Point2D(ev.pageX, ev.pageY);
    if (this.dragMovingCallback !== undefined) { this.dragMovingCallback(ev, this); }
  }

  @action.bound public onWheel(ev: WheelEvent) {
    ev.stopPropagation();
    ev.preventDefault();
  }
}