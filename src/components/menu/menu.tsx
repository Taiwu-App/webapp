import * as React from 'react';

import './style.less';

export interface IMenuProps {
  className?: string;
}

export default class Menu extends React.Component<IMenuProps> {
  public static defaultProps: IMenuProps = {
    className: ''
  };
  constructor(props: IMenuProps) {
    super(props);
  }

  public render() {
    return (
      <menu className={`lt-menu ${this.props.className}`}>
        {this.props.children}
      </menu>
    );
  }
}