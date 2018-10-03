import { observer } from 'mobx-react';
import * as React from 'react';

import SliderStore, { ISliderStore } from './store';
import './style.less';

interface IProps {
  className?: string;
  store?: ISliderStore;
}

@observer
export default class SliderComponent extends React.Component<IProps> {
  public static defaultProps: IProps = {
    className: '',
    store: new SliderStore()
  };
  private containerRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: IProps) {
    super(props);
    this.props.store!.containerRef = this.containerRef;
  }

  public render() {
    const circleClassNames = ['lt-slider__circle'];
    if (this.props.store!.isDragging) { circleClassNames.push('dragging'); }
    return (
      <div
        className={`lt-slider__wrapper ${this.props.className}`}
        ref={this.containerRef}
      >
        <div
          className="lt-slider__line lt-slider__line--left clickable"
          style={{flexGrow: this.props.store!.ratioLeft}}
          onClick={this.props.store!.onContainerClicked}
        />
        <div
          className={circleClassNames.join(' ')}
          style={{left: `${this.props.store!.ratioLeft}%`}}
          draggable={true}
          onMouseDown={this.props.store!.onDragStart}
        />
        <div
          className="lt-slider__line lt-slider__line--right clickable"
          style={{flexGrow: this.props.store!.ratioRight}}
          onClick={this.props.store!.onContainerClicked}
        />
      </div>
    );
  }
}