import { observer } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Slider from '@/components/slider';
import { ISliderStore } from '@/components/slider/store';
import bindthis from '@/decorators/bindthis';
import { IPlaceholder } from '@/models/buildings';
import Placeholder, { DraggablePlaceholder } from './placeholder';
import './style.less';

export interface ISideBarStore {
  cellSize: number;
  filteredPlaceholders: IPlaceholder[];
  isZoomBarDragging: boolean;
  sliderStore: ISliderStore;
  zoomRatio: number;

  offsetRatio: (offset: number) => any;
  placeholderDraggingBegin: (ev: React.MouseEvent<HTMLElement>, ref: React.RefObject<DraggablePlaceholder>) => any;
}

interface IProps {
  store: ISideBarStore;
}

export const containerStyle = {
  marginLeft: 12,
  width: 160
};

@observer
export default class SideBar extends React.Component<IProps> {
  private iconClassName: string = 'build-plan-aside__icon';

  private get zoomRatio() {
    return this.props.store!.zoomRatio;
  }
  // generate some class names dynamically
  private get zoomInIconClasses() {
    const classes = [this.iconClassName, `${this.iconClassName}--zoom-in`];
    if (this.zoomRatio === 100) { classes.push(`${this.iconClassName}--disabled`); }
    else { classes.push('clickable'); }
    return classes;
  }
  private get zoomOutIconClasses() {
    const classes = [this.iconClassName, `${this.iconClassName}--zoom-out`];
    if (this.zoomRatio === 0) { classes.push(`${this.iconClassName}--disabled`); }
    else { classes.push('clickable'); }
    return classes;
  }
  private get moveIconClasses() {
    return [this.iconClassName, `${this.iconClassName}--pan`, 'clickable'];
  }
  private get sliderClasses() {
    const classes = ['build-plan-aside__zoom-slider'];
    if (this.props.store!.isZoomBarDragging) { classes.push('dragging'); }    
    return classes;
  }

  public render() {
    const { offsetRatio } = this.props.store!;
    return (
      <aside
        className="build-plan-aside__container"
        style={containerStyle}
      >
        {/* tool bar begin */}
        <section className="build-plan-aside__tool-bar">
          <div className="build-plan-aside__zoom-container">
            <i
              className={this.zoomOutIconClasses.join(' ')}
              onClick={offsetRatio.bind(this.props.store, -10)}
            />
            <Slider
              className={this.sliderClasses.join(' ')}
              store={this.props.store!.sliderStore}
            />
            <i
              className={this.zoomInIconClasses.join(' ')}
              onClick={offsetRatio.bind(this.props.store, 10)}
            />
          </div>
          <i className={this.moveIconClasses.join(' ')} />
        </section>
        {/* tool bar end */}

        {/* filter too bar */}

        {/* placeholders begin */}
        <div className="build-plan-aside__placeholder-scroll">
          <ul className="build-plan-aside__placeholder-list">
            {this.props.store.filteredPlaceholders.map(
              p => (
                <Placeholder
                  {...p}
                  key={p.name}
                  size={containerStyle.width / 2 - 1} 
                  className="build-plan-aside__placeholder"
                  handleMousedown={this.createDraggablePlaceholder}
                />
              )
            )}
          </ul>
        </div>
        {/* placeholders end */}
      </aside>
    );
  } // render

  // create a draggable element, then pass it to the store
  @bindthis private createDraggablePlaceholder(ev: React.MouseEvent<HTMLElement>, props: IPlaceholder) {
    const container = document.createElement('div');
    const { pageX, pageY } = ev;
    const { cellSize } = this.props.store;
    container.style.left = `${pageX - cellSize / 2}px`;
    container.style.position = 'absolute';
    container.style.top = `${pageY - cellSize / 2}px`;
    // container.id='123123';
    const ref: React.RefObject<DraggablePlaceholder> = React.createRef();

    document.getElementsByTagName('body')[0].appendChild(container);
    ReactDOM.render(
      <DraggablePlaceholder
        ref={ref}
        {...props}
        size={cellSize}
      />,
      container
    );
    this.props.store.placeholderDraggingBegin(ev, ref);
  }
}