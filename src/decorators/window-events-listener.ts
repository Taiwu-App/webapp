import * as React from 'react';

export interface IDynamicSize {
  handleResize: () => void;
}

export function attachResizeListener<T extends {new(...args:any[]): React.Component<any, IDynamicSize>}> (constructor:T) {
  return class extends constructor {
    public componentDidMount() {
      if (super.componentDidMount !== undefined) { super.componentDidMount(); }
      window.addEventListener('resize', this.state.handleResize);
      this.state.handleResize();
    }
    public componentWillUnmount() {
      if (super.componentWillUnmount !== undefined) { super.componentWillUnmount(); }
      window.removeEventListener('resize', this.state.handleResize);
    }
  };
}
