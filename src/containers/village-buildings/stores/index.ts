import { action, computed, observable } from 'mobx';
import * as ReactDOM from 'react-dom';

import bindthis from '@/decorators/bindthis';
import { IDraggableStore } from '@/decorators/draggable/store';
import { IPlaceholder } from '@/models/buildings';
import Point2D from '@/models/coordinate-2d';
import { IModuleStore as IBoardGlobalStore } from '../board';
import { createDraggablePlaceholder } from '../placeholder';
import { IModuleStore as ISideBarGlobalStore } from '../side-bar';
import BoardStore from './board';
import SideBarStore from './side-bar';

export default class ModuleStore implements ISideBarGlobalStore, IBoardGlobalStore {
  public readonly boardStore: BoardStore;
  public readonly sideBarStore: SideBarStore;
  @observable public displayedBoardWidth: number = 0;

  @observable public hoveredPlaceholder: IPlaceholder | null = null;
  @observable private draggingPlaceholder: IPlaceholder | null = null;
  private draggingStore: IDraggableStore | null = null;
  // div container to mount the draggable placeholder
  private _draggableContainer: HTMLDivElement;
  private get draggableContainer() {
    if (this._draggableContainer === undefined) {
      this._draggableContainer = document.createElement('div');
      this._draggableContainer.style.display = 'none';
      document.getElementsByTagName('body')[0].appendChild(this._draggableContainer);
    }
    return this._draggableContainer;
  }

  constructor(){
    this.sideBarStore = new SideBarStore();
    this.boardStore = new BoardStore(this.sideBarStore.sliderStore);
  }

  @computed public get cellSize(): number {
    return this.boardStore.cellSize;
  }

  // tips at the top of the border
  @computed public get tipsMessage(): string {
    if (this.draggingPlaceholder !== null) {
      return '按右键取消拖拽;按DELETE删除当前元素';
    } else { return ''; }
  }

  /**
   * called when placeholder on the board start dragging
   * @param props infos about placeholder
   * @param rowIdx rowIdx at the board, is undefined if it is dragged from the side-bar
   * @param columnIdx same as rowIdx
   */
  @action.bound public handleDragStart(props: IPlaceholder, store: IDraggableStore, rowIdx?: number, columnIdx?: number) {
    if (store.containerRef.current !== null) { store.containerRef.current.style.position = 'absolute'; }
    props.rowIdx = rowIdx;
    props.columnIdx = columnIdx;
    this.draggingPlaceholder = props;
    // this.mouseLeavePlaceholder();
    this.draggingStore = store;
    this.bindWindowListeners();
  }
  
  // create draggable element and mount it to the body
  @action.bound public mountDraggablePlaceholderFromSidebar(ev: React.MouseEvent<HTMLElement>, props: IPlaceholder): void {
    const { pageX, pageY } = ev;
    this.draggableContainer.style.left = `${pageX - this.cellSize * 3 / 4}px`;
    this.draggableContainer.style.position = 'absolute';
    this.draggableContainer.style.top = `${pageY - this.cellSize * 3 / 4}px`;
    this.draggableContainer.style.display = 'block';
    // init draggable configures
    const node = createDraggablePlaceholder({
      info: props,
      size: this.cellSize
    }, {
      onDragEnd: this.placeholderDragEnd,
      onDragStart: (_, store) => { this.handleDragStart(props, store); },
      onMounted: (store) => { store.startDrag(ev); }
    });
    // mount element and dispatch an click event to init the dragging
    ReactDOM.render(node, this.draggableContainer);
  }

  // callback when drag finish
  @action.bound public placeholderDragEnd(ev: MouseEvent): void {
    if (this.draggingStore === null) { return; }
    if (this.draggingStore.containerRef.current !== null) {
      this.draggingStore.containerRef.current.style.position = 'absolute';
    }
    const { clientX, clientY } = ev;
    this.boardStore.handleDrop(new Point2D(clientX, clientY), this.draggingPlaceholder);
    // this.mouseEnterPlaceholder(this.draggingPlaceholder!);
    this.draggingPlaceholder = null;
    this.draggingStore = null;
    // the dom is not mounted on the new draggable container
    // it indicates that the draggable dom comes from the board
    if (this.draggableContainer.style.display === 'none') { return; }
    ReactDOM.unmountComponentAtNode(this.draggableContainer);
    this.draggableContainer.style.display = 'none';
  }

  // delete the current dragging placeholder
  @action.bound private deleteDraggingPlaceholder(ev: KeyboardEvent) {
    if (ev.code !== 'Delete' || this.draggingPlaceholder === null || this.draggingStore === null) { return; }
    ev.stopPropagation();
    ev.preventDefault();
    const { rowIdx = -1, columnIdx = -1 } = this.draggingPlaceholder;
    this.dropNothing();
    this.boardStore.removePlaceholderAt(rowIdx, columnIdx);
    setTimeout(this.removeWindowListeners);
  }
  // put the current dragging placeholder back to its original position
  @action.bound private resetDraggingPlaceholder(ev: MouseEvent) {
    if (ev.button !== 2 || this.draggingPlaceholder === null || this.draggingStore === null) { return; }
    ev.stopPropagation();
    ev.preventDefault();
    this.dropNothing();
    setTimeout(this.removeWindowListeners);
  }
  // terminate the dragging and clear the draggingPlaceholder and draggingStore
  @action.bound private dropNothing() {
    if (this.draggingStore === null) { return; }
    // endDrag will trigger drop in ./board.ts
    // a position(0,0) will be sent and it is clearly out of visible area of the dragging area
    // which will trigger a reset
    this.draggingStore.endDrag(new MouseEvent('mousedown'));
    this.draggingPlaceholder = null;
    this.draggingStore = null;
  }
  @bindthis private prevent(ev: MouseEvent | React.MouseEvent<HTMLElement>) {
    ev.preventDefault();
    ev.stopPropagation();
  }
  @bindthis private bindWindowListeners() {
    window.addEventListener('keydown', this.deleteDraggingPlaceholder, true);
    window.addEventListener('contextmenu', this.prevent);
    window.addEventListener('mousedown', this.resetDraggingPlaceholder, true);
  }
  @bindthis private removeWindowListeners() {
    window.removeEventListener('keydown', this.deleteDraggingPlaceholder, true);
    window.removeEventListener('contextmenu', this.prevent);
    window.removeEventListener('mousedown', this.resetDraggingPlaceholder, true);
  }

  @action.bound public mouseEnterPlaceholder(info: IPlaceholder) {
    this.hoveredPlaceholder = info;
  }
  @action.bound public mouseLeavePlaceholder() {
    this.hoveredPlaceholder = null;
  }
}
