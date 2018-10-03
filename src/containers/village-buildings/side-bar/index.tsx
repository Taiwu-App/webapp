import { StandardLonghandProperties } from 'csstype';
import { observer } from 'mobx-react';
import * as React from 'react';

import Slider from '@/components/slider';
import LocalStore from './store';
import './style.less';

interface IProps {
  store?: LocalStore;
}

@observer
export default class SideBar extends React.Component<IProps> {
  public static defaultProps: IProps = {
    store: new LocalStore()
  };
  public containerStyle: StandardLonghandProperties = {
    marginLeft: '12px',
    width: '160px'
  };

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
        style={this.containerStyle}
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
      </aside>
    );
  }
}