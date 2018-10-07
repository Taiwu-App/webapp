import * as React from 'react';

import './style.less';

interface IProp {
  className?: string;
}

export default class FullHeightModal extends React.Component<IProp> {
  public static defaultProps: IProp = {
    className: ''
  };
  public render() {
    return (
      <div className={`lt-full-height-modal ${this.props.className}`}>
        {this.props.children}
      </div>
    );
  }
}