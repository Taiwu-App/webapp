import { StandardLonghandProperties } from 'csstype';
import * as React from 'react';

import Slider from '@/components/slider';
import bindthis from '@/decorators/bindthis';
import './style.less';

interface IProp {
  containerStyle: StandardLonghandProperties;
  handleZoom: (ratio: number) => void;
  zoomRatio: number;
}

export default class SideBarComponent extends React.Component<IProp> {
  private iconClassName: string = 'build-plan-aside__icon';

  private get zoomInIconClasses() {
    const classes = [this.iconClassName, `${this.iconClassName}--zoom-in`];
    if (this.props.zoomRatio === 100) { classes.push(`${this.iconClassName}--disabled`); }
    else { classes.push('clickable'); }
    return classes;
  }

  private get zoomOutIconClasses() {
    const classes = [this.iconClassName, `${this.iconClassName}--zoom-out`];
    if (this.props.zoomRatio === 0) { classes.push(`${this.iconClassName}--disabled`); }
    else { classes.push('clickable'); }
    return classes;
  }

  private get moveIconClasses() {
    return [this.iconClassName, `${this.iconClassName}--pan`, 'clickable'];
  }

  public render() {
    return (
      <aside
        className="build-plan-aside__container"
        style={this.props.containerStyle}
      >
        {/* tool bar begin */}
        <section className="build-plan-aside__tool-bar">
          <div className="build-plan-aside__zoom-container">
            <i
              className={this.zoomOutIconClasses.join(' ')}
              onClick={this.onZoomOutClicked}
            />
            <Slider
              className="build-plan-aside__zoom-slider"
              onChange={this.handleZoom}
              value={this.props.zoomRatio}
            />
            <i
              className={this.zoomInIconClasses.join(' ')}
              onClick={this.onZoomInClicked}
            />
          </div>
          <i className={this.moveIconClasses.join(' ')} />
        </section>
        {/* tool bar end */}
      </aside>
    );
  }

  @bindthis private handleZoom(ratio: number) {
    this.props.handleZoom(ratio);
  }

  @bindthis private onZoomInClicked() {
    let newRatio = this.props.zoomRatio + 10;
    if (newRatio > 100) { newRatio = 100; }
    this.handleZoom(newRatio);
  }

  @bindthis private onZoomOutClicked() {
    let newRatio = this.props.zoomRatio - 10;
    if (newRatio < 0) { newRatio = 0; }
    this.handleZoom(newRatio);
  }
}