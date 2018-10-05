import { observer } from 'mobx-react';
import * as React from 'react';

import Slider from '@/components/slider';
import { ISliderStore } from '@/components/slider/store';
import { IPlaceholder } from '@/models/buildings';
import Placeholder from '../placeholder';
import './style.less';

export interface ISideBarStore {
  filteredPlaceholders: IPlaceholder[];
  isZoomBarDragging: boolean;
  sliderStore: ISliderStore;
  zoomRatio: number;

  offsetRatio: (offset: number) => any;
}

export interface IModuleStore {
  cellSize: number;
  sideBarStore: ISideBarStore;

  mountDraggablePlaceholderFromSidebar :(ev: React.MouseEvent<HTMLElement>, props: IPlaceholder) => any;
}

interface IProps {
  store: IModuleStore;
}

export const containerStyle = {
  marginLeft: 12,
  width: 160
};

@observer
export default class SideBar extends React.Component<IProps> {
  private iconClassName: string = 'build-plan-aside__icon';

  private get zoomRatio() {
    return this.props.store.sideBarStore.zoomRatio;
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
  private get sliderClasses() {
    const classes = ['build-plan-aside__zoom-slider'];
    if (this.props.store.sideBarStore.isZoomBarDragging) { classes.push('dragging'); }    
    return classes;
  }

  public render() {
    const { mountDraggablePlaceholderFromSidebar, sideBarStore } = this.props.store;
    const { filteredPlaceholders, offsetRatio, sliderStore } = sideBarStore;
    return (
      <aside
        className="build-plan-aside__container"
        style={containerStyle}
      >
        {/* tool bar begin */}
        <section className="build-plan-aside__tool-bar">
          <i
            className={this.zoomOutIconClasses.join(' ')}
            onClick={offsetRatio.bind(sideBarStore, -10)}
          />
          <Slider
            className={this.sliderClasses.join(' ')}
            store={sliderStore}
          />
          <i
            className={this.zoomInIconClasses.join(' ')}
            onClick={offsetRatio.bind(sideBarStore, 10)}
          />
        </section>
        {/* tool bar end */}

        {/* filter too bar */}

        {/* placeholders begin */}
        <div className="build-plan-aside__placeholder-scroll">
          <ul className="build-plan-aside__placeholder-list">            
            {filteredPlaceholders.map(
              p => (
                <li className="build-plan-aside__placeholder-item" key={p.name}>
                  <Placeholder
                    info={p}
                    size={containerStyle.width / 2 - 1} 
                    className="build-plan-aside__placeholder"
                    handleMousedown={mountDraggablePlaceholderFromSidebar}
                  />
                </li>
              )
            )}
          </ul>
        </div>
        {/* placeholders end */}
      </aside>
    );
  } // render
}