import { observer } from 'mobx-react';
import * as React from 'react';

import Slider from '@/components/slider';
import { ISliderStore } from '@/components/slider/store';
import { IPlaceholder } from '@/models/buildings';
import Placeholder from '../placeholder';
import { IFilterStore } from './filters';
import './style.less';

export interface ISideBarStore {
  filteredPlaceholders: IPlaceholder[];
  isZoomBarDragging: boolean;
  isFilterDisplay: boolean;
  listHeight: number;
  sliderStore: ISliderStore;
  filterStore: IFilterStore;
  scrollDistance: number;
  zoomRatio: number;

  handleListScroll: (ev: React.WheelEvent<HTMLUListElement>) => any;
  toggleFilterDisplay: () => void;
  offsetRatio: (offset: number) => any;
}

export interface IModuleStore {
  cellSize: number;
  sideBarStore: ISideBarStore;

  mountDraggablePlaceholderFromSidebar :(ev: React.MouseEvent<HTMLElement>, props: IPlaceholder) => any;
  mouseEnterPlaceholder: (info: IPlaceholder) => any;
  mouseLeavePlaceholder: () => any;
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
  private get filterIconClasses() {
    const classes = [this.iconClassName, `${this.iconClassName}--filter`];
    classes.push('clickable');
    if (this.props.store.sideBarStore.isFilterDisplay) { classes.push('active'); }
    return classes;
  }

  public render() {
    const { mountDraggablePlaceholderFromSidebar, sideBarStore, mouseEnterPlaceholder, mouseLeavePlaceholder } = this.props.store;
    const { filteredPlaceholders, offsetRatio, sliderStore, toggleFilterDisplay, handleListScroll, listHeight, scrollDistance } = sideBarStore;
    return (
      <aside
        className="build-plan-aside__container"
        style={containerStyle}
      >
        {/* tool bar begin */}
        <section className="build-plan-aside__tool-bar">
          <div className="build-plan-aside__zoom">
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
          </div>
          <div className="build-plan-aside__filter">
            <i
              className={this.filterIconClasses.join(' ')}
              onClick={toggleFilterDisplay}
            />
          </div>
        </section>
        {/* tool bar end */}

        {/* placeholders begin */}
        <div
          className="build-plan-aside__placeholder-scroll"
          style={{maxHeight: listHeight}}
        >
          <ul
            className="build-plan-aside__placeholder-list"
            onWheel={handleListScroll}
            style={{transform: `translateY(-${scrollDistance}px)`}}
          >            
            {filteredPlaceholders.map(
              p => (
                <li className="build-plan-aside__placeholder-item" key={p.name}>
                  <Placeholder
                    info={p}
                    size={containerStyle.width / 2 - 1} 
                    className="build-plan-aside__placeholder"
                    handleMousedown={mountDraggablePlaceholderFromSidebar}
                    handleMouseEnter={mouseEnterPlaceholder}
                    handleMouseLeave={mouseLeavePlaceholder}
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
