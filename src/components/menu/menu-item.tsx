import * as React from 'react';

import './style.less';

export interface IMenuItemProps {
  className?: string;
}

export default class Menu extends React.Component<IMenuItemProps> {
  public static defaultProps: IMenuItemProps = {
    className: ''
  };
  constructor(props: IMenuItemProps) {
    super(props);
  }

  public render() {
    return (
      <li className={`lt-menu-item ${this.props.className}`}>
        {this.props.children}
      </li>
    );
  }
}