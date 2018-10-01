import * as React from 'react';

import MessageChannel from '@/utils/message-channel';
import Board from './board';
import SideBar from './side-bar';
import './style.less';

export default class VillageBuildings extends React.Component {
  private channel: MessageChannel;
  constructor(props: any) {
    super(props);
    this.channel = new MessageChannel();
  }
  public render(){
    return (
      <main className="main-content build-plan__container">
        <div className="build-plan__middle-container">
          <Board
            channel={this.channel}
          />
        </div>
        <SideBar
          channel={this.channel}
        />
      </main>
    );
  }
}