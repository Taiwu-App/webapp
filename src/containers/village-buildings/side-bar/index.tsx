import * as React from 'react';

import bindthis from '@/decorators/bindthis';
import MessageChannel from '@/utils/message-channel';
import MessageEvents from '../message-events';
import SideBarComponent from './component';

export interface ISideBarProps {
  channel: MessageChannel;
}

export default class SideBar extends React.Component<ISideBarProps> {
  public render() {
    return (
      <SideBarComponent
        handleZoom={this.handleZoom}
      />
    );
  }

  @bindthis
  private handleZoom(mode: 'in' | 'out') {
    this.props.channel.publish(MessageEvents.gridSizeChange.toString(), { mode });
  }
}
