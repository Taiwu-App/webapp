import { observer } from 'mobx-react';
import * as React from 'react';

import { DraggableStore, IDraggableStore } from './store';
import './style.less';

export interface IDragConfig {
  enableWheel?: boolean;
  store?: IDraggableStore;

  onDragStart?: (ev: React.MouseEvent<HTMLElement>) => any;
  onDragEnd?: (ev: MouseEvent) => any;
  onDragMoving?: (ev: MouseEvent) => any;
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
      constructor(...props: any[]) {
        super(...props);
        this.store = config.store!;
      }
      public render() {
        const className = `lt-draggable__container${this.store.isDragging ? ' dragging' : ''}`;
        const { x, y } = this.store.translate;
        return (
          <div
            className={className}
            children={super.render()}
            onMouseDown={this.store.onDragStart}
            style={{ transform: `translate(${x}px, ${y}px)` }}
          />
        );
      }
    }
    return DraggableClass;
  };
}
