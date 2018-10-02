import * as React from 'react';

import bindthis from '@/decorators/bindthis';
import SliderComponent from './component';

export interface ISliderProps {
  className?: string;
  // numerical value from 0 to 100, value of the left part
  value: number;
  onChange?: (val: number) => any;
}

export interface ISliderState {
  isDragging: boolean;
}

export default class Slider extends React.Component<ISliderProps, ISliderState> {
  public static defaultValues: ISliderProps = {
    className: '',
    value: 50
  };

  private childRef: React.RefObject<SliderComponent> = React.createRef();
  // @see ./component.tsx:bondingBox
  private get boundingBox(): number[] {
    if (this.childRef.current === null) { return [0,0,0,0]; }
    return this.childRef.current.bondingBox;
  }

  constructor(props: ISliderProps) {
    super(props);
    this.state = {
      isDragging: false
    };
  }

  public render() {
    return (
      <SliderComponent
        ref={this.childRef}
        className={this.props.className!}
        value={this.props.value}
        onDragStart={this.handleDragStart}
        onLineClicked={this.handleLineClicked}
        isDragging={this.state.isDragging}
      />
    );
  }

  @bindthis private handleDragStart(ev: React.MouseEvent<HTMLDivElement>) {
    ev.preventDefault();
    if (this.childRef.current === null) { return; }
    this.setState({
      ...this.state,
      isDragging: true
    });
    window.addEventListener('mousemove', this.handleDragMove, true);
    window.addEventListener('mouseup', this.handleDragEnd, true);
  }

  @bindthis private handleDragEnd(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this.setState({
      ...this.state,
      isDragging: false
    });
    window.removeEventListener('mousemove', this.handleDragMove, true);
    window.removeEventListener('mouseup', this.handleDragEnd, true);
  }

  // slider moving event, value is limited to [0, 100]
  @bindthis private handleDragMove(ev: MouseEvent) {
    ev.stopPropagation();
    ev.preventDefault();    
    this.updateValueBasedOnX(ev.clientX);
  }

  @bindthis private handleLineClicked(ev: React.MouseEvent<HTMLDivElement>) {
    this.updateValueBasedOnX(ev.clientX);
  }

  /**
   * calculate state.value based on the clientX
   * then update the state using setState
   * @param clientX clientX of the target position
   */
  @bindthis private updateValueBasedOnX(clientX: number): void {
    const x0 = this.boundingBox[0];
    const x1 = this.boundingBox[2];
    if (Math.abs(x0 - x1) < 1e-8) { return; }

    let value = (clientX - x0) / (x1 - x0) * 100;
    if (value < 0) { value = 0; }
    else if (value > 100) { value = 100; }

    if(this.props.onChange !== undefined) { this.props.onChange(value); }
  }
}
