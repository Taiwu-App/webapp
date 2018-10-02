import { StandardLonghandProperties } from 'csstype';
import { observer } from 'mobx-react';
import * as React from 'react';

import Slider from '@/components/slider';
import moduleStore from '../module-store';
import './style.less';

@observer
export default class SideBar extends React.Component {
  public containerStyle: StandardLonghandProperties = {
    marginLeft: '12px',
    width: '160px'
  };
  
  private iconClassName: string = 'build-plan-aside__icon';
  private get zoomRatio() { return moduleStore.cellSizeZoomRatio; }
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

  public render() {
    const { cellSizeZoomRatio, handleZoomInClicked, HandleZoomOutClicked, setRatio } = moduleStore;
    return (
      <aside
        className="build-plan-aside__container"
        style={this.containerStyle}
      >
        {/* tool bar begin */}
        <section className="build-plan-aside__tool-bar">
          <div className="build-plan-aside__zoom-container">
            <i
              className={this.zoomOutIconClasses.join(' ')}
              onClick={HandleZoomOutClicked}
            />
            <Slider
              className="build-plan-aside__zoom-slider"
              onChange={setRatio}
              value={cellSizeZoomRatio}
            />
            <i
              className={this.zoomInIconClasses.join(' ')}
              onClick={handleZoomInClicked}
            />
          </div>
          <i className={this.moveIconClasses.join(' ')} />
        </section>
        {/* tool bar end */}
      </aside>
    );
  }
}