import { action, computed } from 'mobx';
import * as ReactDOM from 'react-dom';

import { IDraggableStore } from '@/decorators/draggable/store';
import { IPlaceholder } from '@/models/buildings';
import Point2D from '@/models/coordinate-2d';
import { IModuleStore as IBoardGlobalStore } from '../board';
import { createDraggablePlaceholder } from '../placeholder';
import { IModuleStore as ISideBarGlobalStore } from '../side-bar';
import BoardStore, { IPlaceholderOnBoard } from './board';
import SideBarStore from './side-bar';

export default class ModuleStore implements ISideBarGlobalStore, IBoardGlobalStore {
  public readonly boardStore: BoardStore;
  public readonly sideBarStore: SideBarStore;
  private draggingPlaceholder: IPlaceholderOnBoard | null = null;
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

  /**
   * called when placeholder on the board start dragging
   * @param props infos about placeholder
   * @param rowIdx rowIdx at the board, is undefined if it is dragged from the side-bar
   * @param columnIdx same as rowIdx
   */
  @action.bound public handleDragStart(props: IPlaceholder, store: IDraggableStore, rowIdx: number, columnIdx: number) {
    if (store.containerRef.current !== null) { store.containerRef.current.style.position = 'absolute'; }
    this.draggingPlaceholder = { ...props, rowIdx, columnIdx };
  }
  // called when new draggable placeholder is mounted
  @action.bound public handleDraggableMounted(props: IPlaceholder, store: IDraggableStore, ev: React.MouseEvent<HTMLElement>): void {
    // console.log(store.containerRef);
    if (store.containerRef.current !== null) { store.containerRef.current.style.position = 'absolute'; }
    this.draggingPlaceholder = { ...props, rowIdx: undefined, columnIdx: undefined };
    store.onDragStart(ev);
  }
  // create draggable element and mount it to the body
  @action.bound public mountDraggablePlaceholder(ev: React.MouseEvent<HTMLElement>, props: IPlaceholder): void {
    const { pageX, pageY } = ev;
    this.draggableContainer.style.left = `${pageX - this.cellSize * 3 / 4}px`;
    this.draggableContainer.style.position = 'absolute';
    this.draggableContainer.style.top = `${pageY - this.cellSize * 3 / 4}px`;
    this.draggableContainer.style.display = 'block';
    // init draggable configures
    const node = createDraggablePlaceholder({
      ...props,
      size: this.cellSize
    }, {
      onDragEnd: this.placeholderDragEnd,
      onMounted: (store) => { this.handleDraggableMounted(props, store, ev); }
    });
    // mount element and dispatch an click event to init the dragging
    ReactDOM.render(node, this.draggableContainer);
  }
  // callback when drag finish
  @action.bound public placeholderDragEnd(ev: MouseEvent, store: IDraggableStore): void {
    if (ev.target === null || this.draggingPlaceholder === null) { return; }
    if (store.containerRef.current !== null) { store.containerRef.current.style.position = 'absolute'; }
    const { clientX, clientY } = ev;
    this.boardStore.handleDrop(new Point2D(clientX, clientY), this.draggingPlaceholder);
    // the dom is not mounted on the new draggable container
    // it indicates that the draggable dom comes from the board
    if (this.draggableContainer.style.display === 'none') { return; }
    const target = ev.target as HTMLLIElement;
    const container = target.parentElement!.parentElement!;
    ReactDOM.unmountComponentAtNode(container);
    this.draggableContainer.style.display = 'none';
  }
}

