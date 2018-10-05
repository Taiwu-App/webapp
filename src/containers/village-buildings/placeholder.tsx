import { StandardLonghandProperties } from 'csstype';
import * as React from 'react';

import bindthis from '@/decorators/bindthis';
import draggable, { IDragConfig } from '@/decorators/draggable';
import { IPlaceholder } from '@/models/buildings';

interface IProps {
  className?: string;
  info: IPlaceholder;
  size: number;
  handleMousedown?: (ev: React.MouseEvent<HTMLElement>, prop: IPlaceholder) => any;
}

export default class Placeholder extends React.Component<IProps> {
  public static defaultProps = {
    className: '',
    styles: {}
  };
  private get style() {
    const info = this.props.info;
    const style: StandardLonghandProperties = {
      backgroundColor: info.backgroundColor,
      color: info.textColor,
      height: `${this.props.size}px`,
      lineHeight: `${this.props.size}px`,
      width: `${this.props.size}px`,
    };
    if (info.icon !== undefined && info.icon.includes('.')) {
      if (info.icon.includes('http')) {
        style.backgroundImage = `url(${info.icon})`;
      } else {
        style.backgroundImage = `url(~@/assets/images/${info.icon})`;
      }
    }
    return style;
  }

  private get content() {
    const info = this.props.info;
    if (info.icon.includes('.')) { return ''; }
    else { return info.icon; }
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
    this.props.handleMousedown(ev, this.props.info);
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
