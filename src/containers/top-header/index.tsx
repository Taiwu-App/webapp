import * as React from 'react';

import './style.less';

export interface ITopHead {
  className?: string;
}

export default class TopHeader extends React.Component<ITopHead> {
  public static defaultProps: ITopHead = {
    className: ''
  };
  public render() {
    return (
      <div className={`top-header ${this.props.className}`}>
        <h1 className="top-header__heading">太吾绘卷微应用</h1>
      </div>
    );
  }
}