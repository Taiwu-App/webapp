import * as React from 'react';

import bindthis from '@/decorators/bindthis';
import './style.less';


export interface IBaseButton {
  className?: string;
  type?: 'primary' | 'default';

  onClick?: (ev: React.MouseEvent<HTMLAnchorElement>) => any;
}

export default class BaseButton extends React.Component<IBaseButton> {
  public static defaultProps: IBaseButton = {
    className: '',
    type: 'default'
  };
  private get wrapperClassName(): string {
    const classNames = ['lt-button'];
    classNames.push('clickable');
    classNames.push(`${classNames[0]}--${this.props.type}`);
    if (this.props.className !== '') { classNames.push(this.props.className!); }
    return classNames.join(' ');
  }
  public render() {
    return (
      <a
        className={this.wrapperClassName}
        onClick={this.onClick}
      >
        {this.props.children}
      </a>
    );
  }

  @bindthis private onClick(ev: React.MouseEvent<HTMLAnchorElement>): void {
    if (this.props.onClick !== undefined) { this.props.onClick(ev); }
  }
}