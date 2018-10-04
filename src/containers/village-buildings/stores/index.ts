import { action, computed } from 'mobx';
import * as ReactDOM from 'react-dom';

import { DraggableStore } from '@/decorators/draggable/store';
import { IPlaceholder } from '@/models/buildings';
import { createDraggablePlaceholder } from '../placeholder';
import { IModuleStore as ISideBarGlobalStore } from '../side-bar';
import BoardStore from './board';
import SideBarStore from './side-bar';

export default class ModuleStore implements ISideBarGlobalStore {
  public readonly boardStore: BoardStore;
  public readonly sideBarStore: SideBarStore;
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

  @computed public get cellSize() {
    return this.boardStore.cellSize;
  }

  // create draggable element and mount it to the body
  @action.bound public mountDraggablePlaceholder(ev: React.MouseEvent<HTMLElement>, props: IPlaceholder) {
    const { pageX, pageY } = ev;
    this.draggableContainer.style.left = `${pageX - this.cellSize * 3 / 4}px`;
    this.draggableContainer.style.position = 'absolute';
    this.draggableContainer.style.top = `${pageY - this.cellSize * 3 / 4}px`;
    this.draggableContainer.style.display = 'block';
    // init draggable configures
    const draggableStore = new DraggableStore();
    const node = createDraggablePlaceholder({
      ...props,
      size: this.cellSize
    }, {
      onDragEnd: this.placeholderDragEnd,
      store: draggableStore,
    });
    // mount element and dispatch an click event to init the dragging
    ReactDOM.render(node, this.draggableContainer);
    draggableStore.onDragStart(ev);
  }

  // callback when drag finish
  @action.bound public placeholderDragEnd(ev: MouseEvent) {
    if (ev.target === null) { return; }
    const target = ev.target as HTMLLIElement;
    const container = target.parentElement!.parentElement!;
    ReactDOM.unmountComponentAtNode(container);
    this.draggableContainer.style.display = 'none';
  }
}

