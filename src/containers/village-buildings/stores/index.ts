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
  @observable private draggingPlaceholder: IPlaceholder | null = null;
  // div container to mount the draggable placeholder
  private _draggableContainer: HTMLDivElement;
  private get draggableContainer() {
    if (this._draggableContainer === undefined) {
      this._draggableContainer = document.createElement('div');
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
      return '按右键删除当前拖动元素';
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
    window.addEventListener('mouseup', (ev) => {
      this.deleteDraggingPlaceholder(ev, store);
    }, { once: true });
    window.addEventListener('contextmenu', this.prevent);
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
  @action.bound public placeholderDragEnd(ev: MouseEvent, store: IDraggableStore): void {
    if (ev.target === null) { return; }
    if (store.containerRef.current !== null) { store.containerRef.current.style.position = 'absolute'; }
    const { clientX, clientY } = ev;
    this.boardStore.handleDrop(new Point2D(clientX, clientY), this.draggingPlaceholder);
    this.draggingPlaceholder = null;
    // the dom is not mounted on the new draggable container
    // it indicates that the draggable dom comes from the board
    if (this.draggableContainer.style.display === 'none') { return; }
    const target = ev.target as HTMLLIElement;
    const container = target.parentElement!.parentElement!;
    ReactDOM.unmountComponentAtNode(container);
    this.draggableContainer.style.display = 'none';
  }

  @action.bound private deleteDraggingPlaceholder(ev: MouseEvent, store: IDraggableStore) {
    if (ev.button !== 2 || this.draggingPlaceholder === null) { return; }
    ev.stopPropagation();
    ev.preventDefault();
    const { rowIdx = -1, columnIdx = -1 } = this.draggingPlaceholder;
    this.draggingPlaceholder = null;
    store.endDrag(ev);
    this.boardStore.removePlaceholderAt(rowIdx, columnIdx);
    window.removeEventListener('contextmenu', this.prevent);
  }

  @bindthis private prevent(ev: MouseEvent | React.MouseEvent<HTMLElement>) {
    ev.preventDefault();
  }
}
