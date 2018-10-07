import * as React from 'react';

import './style.less';

export default class FullscreenMask extends React.Component {
  public render() {
    return (
      <div className="lt-fullscreen-mask">
        {this.props.children}
      </div>
    );
  }
}