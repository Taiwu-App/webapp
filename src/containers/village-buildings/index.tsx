import { observer } from 'mobx-react';
import * as React from 'react';

import bindthis from '@/decorators/bindthis';
import { attachResizeListener, IDynamicSize } from '@/decorators/window-events-listener';
import MessageChannel from '@/utils/message-channel';
import Board from './board';
import moduleStore from './module-store';
import SideBar from './side-bar';
import './style.less';

export interface IVillageBuildingsState extends IDynamicSize {
  boardWidth: number;
}

@observer
class VillageBuildings extends React.Component<{}, IVillageBuildingsState> {
  private channel: MessageChannel;
  private containerRef: React.RefObject<HTMLMainElement> = React.createRef();
  private sideBarRef: React.RefObject<SideBar> = React.createRef();
  constructor(props: any) {
    super(props);
    this.state = {
      boardWidth: 0,
      handleResize: this.handleResize
    };
    this.channel = new MessageChannel();
  }

  public render(){
    return (
      <main
        className="main-content build-plan__container"
        ref={this.containerRef}
      >
        <div
          className="build-plan__middle-container"
          style={{maxWidth: this.state.boardWidth}}
        >
          <Board
            channel={this.channel}
          />
        </div>
        <SideBar
          ref={this.sideBarRef}
          store={moduleStore.sideBarStore}
        />
      </main>
    );
  }

  @bindthis
  private handleResize() {
    if (this.containerRef.current === null || this.sideBarRef.current === null) { return; }
    const containerStyle = this.sideBarRef.current.containerStyle;
    const width = parseInt((containerStyle.width as string).split('px')[0], 10);
    const marginLeft = parseInt((containerStyle.marginLeft as string).split('px')[0], 10);
    this.setState({
      ...this.state,
      boardWidth: this.containerRef.current.clientWidth - width - marginLeft
    });
  }
}

export default attachResizeListener(VillageBuildings);
