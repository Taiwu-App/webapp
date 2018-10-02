import { StandardLonghandProperties } from 'csstype';
import * as React from 'react';

import bindthis from '@/decorators/bindthis';
import MessageChannel from '@/utils/message-channel';
import MessageEvents from '../message-events';
import SideBarComponent from './component';

export interface ISideBarProps {
  channel: MessageChannel;
}

export interface ISideBarState {
  zoomRatio: number;
}

export default class SideBar extends React.Component<ISideBarProps, ISideBarState> {
  public containerStyle: StandardLonghandProperties = {
    marginLeft: '12px',
    width: '160px'
  };
  
  constructor(props: ISideBarProps) {
    super(props);
    this.state = {
      zoomRatio: 30
    };
  }

  public componentDidMount() {
    // initialize the cell size of the board
    this.handleZoom(this.state.zoomRatio);
  }

  public render() {
    return (
      <SideBarComponent
        handleZoom={this.handleZoom}
        containerStyle={this.containerStyle}
        zoomRatio={this.state.zoomRatio}
      />
    );
  }

  @bindthis private handleZoom(ratio: number) {
    this.setState({ ...this.state, zoomRatio: ratio });
    this.props.channel.publish(MessageEvents.gridSizeChange.toString(), { ratio });
  }
}
