import * as React from 'react';

import bindthis from '@/decorators/bindthis';
import './style.less';

interface IProps {
  allowIntermediate?: boolean;
  className?: string;
  value: boolean | 'intermediate';

  onClick?: (currentValue: boolean | 'intermediate') => any;
}

export default class BaseCheckbox extends React.Component<IProps> {
  public static defaultProps: IProps = {
    allowIntermediate: false,
    className: '',
    value: true,
    // tslint:disable-next-line
    onClick: () => {}
  };

  private get wrapperClass() {
    const classNames = ['lt-checkbox__wrapper', 'clickable'];
    if (this.props.className !== '') { classNames.push(this.props.className!); }
    if (this.props.value! === true) { classNames.push('lt-checkbox__wrapper--checked'); }
    else if (this.props.value! === 'intermediate') { classNames.push('lt-checkbox__wrapper--intermediate'); }
    return classNames.join(' ');
  }
  private get outerClass() {
    const classNames = ['lt-checkbox--outer'];
    if (this.props.value! === true) { classNames.push('lt-checkbox--outer--checked'); }
    else if (this.props.value! === 'intermediate') { classNames.push('lt-checkbox--outer--intermediate'); }
    return classNames.join(' ');
  }
  private get innerClass() {
    const classNames = ['lt-checkbox--inner'];
    if (this.props.value! === true) { classNames.push('lt-checkbox--inner--checked'); }
    else if (this.props.value! === 'intermediate') { classNames.push('lt-checkbox--inner--intermediate'); }
    return classNames.join(' ');
  }

  public render() {
    return (
      <label className={this.wrapperClass} onClick={this.handleClick}>
        <span className={this.outerClass}>
          <span className={this.innerClass}/>
          <input type="checkbox" className="lt-checkbox--input clickable"/>
        </span>
        <span className="lt-checkbox__text">{this.props.children}</span>
      </label>
    );
  }

  @bindthis private handleClick(ev: React.MouseEvent<HTMLLabelElement>) {
    ev.stopPropagation();
    ev.preventDefault();
    this.props.onClick!(this.props.value);
  }
}