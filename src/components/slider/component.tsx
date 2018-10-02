import * as React from 'react';

import './style.less';

interface IProps {
  className: string;
  isDragging: boolean;
  onDragStart: (ev: React.MouseEvent<HTMLDivElement>) => any;
  onLineClicked: (ev: React.MouseEvent<HTMLDivElement>) => any;
  value: number;
}

export default class SliderComponent extends React.Component<IProps> {
  private containerRef: React.RefObject<HTMLDivElement> = React.createRef();
  private get flexLeft(): number {
    if (typeof this.props.value !== 'number' || this.props.value < 0 || this.props.value > 100) { return 50; }
    else { return this.props.value; }
  }

  private get flexRight(): number {
    return 100 - this.flexLeft;
  }

  /**
   * get bounding box (relative to view port)
   * @return {number[]} [x0, y0, x1, y1]
   * (x0, y0) is the bottom left point of the rect
   * (x1, y1) is the top right point of the rect
   * top left of the view port is considered as the origin
   */
  public get bondingBox(): number[] {
    if (this.containerRef.current === null) { return [0,0,0,0]; }
    const rect = this.containerRef.current.getBoundingClientRect();
    return [rect.left, rect.top + rect.height, rect.left + rect.width, rect.top];
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      isDragging: false
    };
  }

  public render() {
    const circleClassNames = ['lt-slider__circle'];
    if (this.props.isDragging) { circleClassNames.push('dragging'); }
    return (
      <div
        className={`lt-slider__wrapper ${this.props.className}`}
        ref={this.containerRef}
      >
        <div
          className="lt-slider__line lt-slider__line--left clickable"
          style={{flexGrow: this.flexLeft}}
          onClick={this.props.onLineClicked}
        />
        <div
          className={circleClassNames.join(' ')}
          style={{left: `${this.flexLeft}%`}}
          draggable={true}
          onMouseDown={this.props.onDragStart}
        />
        <div
          className="lt-slider__line lt-slider__line--right clickable"
          style={{flexGrow: this.flexRight}}
          onClick={this.props.onLineClicked}
        />
      </div>
    );
  }
}