import { observer } from 'mobx-react';
import * as React from 'react';

import { DraggableStore, IDraggableStore } from './store';
import './style.less';

export interface IDragConfig {
  enableWheel?: boolean;
  store?: IDraggableStore;

  onMounted?: (store: IDraggableStore) => any;
  onDragStart?: (ev: React.MouseEvent<HTMLElement>, store: IDraggableStore) => any;
  onDragEnd?: (ev: MouseEvent, store: IDraggableStore) => any;
  onDragMoving?: (ev: MouseEvent, store: IDraggableStore) => any;
}

function applyDefaultConfig(config: IDragConfig) {
  if (config.enableWheel === undefined) { config.enableWheel = true; }
  if (config.store === undefined) { config.store = new DraggableStore(); }
  config.store.dragEndCallback = config.onDragEnd;
  config.store.dragStartCallback = config.onDragStart;
  config.store.dragMovingCallback = config.onDragMoving;
  return config;
}

export default function draggable(config: IDragConfig = {}) {
  config = applyDefaultConfig(config);
  return <T extends {new(...args:any[]): React.Component}> (constructor: T) => {
    @observer
    class DraggableClass extends constructor {
      public readonly store: IDraggableStore;
      private readonly containerRef: React.RefObject<HTMLDivElement> = React.createRef();
      constructor(...props: any[]) {
        super(...props);
        this.store = config.store!;
        this.store.containerRef = this.containerRef;
      }

      public componentDidMount() {
        if (super.componentDidMount !== undefined) { super.componentDidMount(); }
        if (config.onMounted !== undefined) { config.onMounted(this.store); }
      }

      public render() {
        const className = `lt-draggable__container${this.store.isDragging ? ' dragging' : ''}`;
        const { x, y } = this.store.translate;
        return (
          <div
            className={className}
            children={super.render()}
            onMouseDown={this.store.handleMouseDown}
            style={{ transform: `translate(${x}px, ${y}px)` }}
            ref={this.containerRef}
          />
        );
      }
    }
    return DraggableClass;
  };
}
