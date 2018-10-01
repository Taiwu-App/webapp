import * as React from 'react';

import bindthis from '@/decorators/bindthis';

interface IProp {
  handleZoom: (mode: 'in' | 'out') => void;
}

export default class SideBarComponent extends React.Component<IProp> {
  public render() {
    return (
      <aside className="build-plan__side-bar">
        <section className="build-plan__zoom-tools">
          <a
            className="build-plan__zoom--in"
            onClick={this.handleZoomIn}
          >in</a>
          <a
            className="build-plan__zoom--out"
            onClick={this.handleZoomOut}
          >out</a>
        </section>
      </aside>
    );
  }

  @bindthis
  private handleZoomIn() {
    this.props.handleZoom('in');
  }
  
  @bindthis
  private handleZoomOut() {
    this.props.handleZoom('out');
  }
}