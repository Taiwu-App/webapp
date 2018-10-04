import { StandardLonghandProperties } from 'csstype';
import * as React from 'react';

import bindthis from '@/decorators/bindthis';
import draggable, { IDragConfig } from '@/decorators/draggable';
import { IPlaceholder } from '@/models/buildings';

interface IProps extends IPlaceholder {
  className?: string;
  size: number;
  handleMousedown?: (ev: React.MouseEvent<HTMLElement>, prop: IPlaceholder) => any;
}

export default class Placeholder extends React.Component<IProps> {
  public static defaultProps = {
    className: '',
    styles: {}
  };
  private get style() {
    const style: StandardLonghandProperties = {
      backgroundColor: this.props.backgroundColor,
      color: this.props.textColor,
      height: `${this.props.size}px`,
      lineHeight: `${this.props.size}px`,
      width: `${this.props.size}px`,
    };
    if (this.props.icon !== undefined && this.props.icon.includes('.')) {
      if (this.props.icon.includes('http')) {
        style.backgroundImage = `url(${this.props.icon})`;
      } else {
        style.backgroundImage = `url(~@/assets/images/${this.props.icon})`;
      }
    }
    return style;
  }

  private get content() {
    if (this.props.icon.includes('.')) { return ''; }
    else { return this.props.icon; }
  }

  public render() {
    return (
      <li
        className={`build-plan__placeholder ${this.props.className}`}
        style={this.style}
        onMouseDown={this.handleMousedown}
      >
        {this.content}
      </li>
    );
  }

  @bindthis private handleMousedown(ev: React.MouseEvent<HTMLElement>) {
    if (this.props.handleMousedown === undefined || ev.button !== 0) { return; }
    const props = { ...this.props };
    delete props.handleMousedown;
    delete props.className;
    delete props.size;
    this.props.handleMousedown(ev, props);
  }
}

/**
 * factory mode, generate draggable placeholder
 * @param props placeholder props
 * @param config draggable configures
 * @return React node
 */
export function createDraggablePlaceholder(props:IProps ,config: IDragConfig = {}) {
  const element = draggable(config)(Placeholder);
  return React.createElement(element, props);
}
