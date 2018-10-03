import { observer } from 'mobx-react';
import * as React from 'react';

import { DraggableStore, IDraggable } from './store';
import './style.less';

export default function draggable<T extends {new(...args:any[]): React.Component}> (constructor: T) {
  @observer
  class DraggableClass extends constructor {
    private store: IDraggable = new DraggableStore();
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
}