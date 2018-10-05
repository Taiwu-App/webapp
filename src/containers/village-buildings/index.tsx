import { observer } from 'mobx-react';
import * as React from 'react';

import { onResize } from '@/decorators/window-events-listener';
import Board from './board';
import SideBar, { containerStyle as sideBarContainerStyle } from './side-bar';
import ModuleStore from './stores';
import './style.less';


@observer
export default class VillageBuildings extends React.Component {
  private readonly containerRef: React.RefObject<HTMLMainElement> = React.createRef();
  private readonly moduleStore: ModuleStore = new ModuleStore();
  constructor(props: any) {
    super(props);
    this.state = {
      boardWidth: 0,
      handleResize: this.handleResize
    };
  }

  public render(){
    return (
      <main
        className="main-content build-plan__container"
        ref={this.containerRef}
      >
        <div className="build-plan__middle-container">
          <article className="build-plan__tips">
           <span className="build-plan__tips_content build-plan__tips_content--left">
              当前建筑数量:{this.moduleStore.boardStore.buildingCount}
            </span>
            <h4 className="build-plan__tips_content build-plan__tips_content--right">
              {this.moduleStore.tipsMessage}
            </h4>
          </article>
            <div
              className="build-plan__board-frame"
              style={{maxWidth: this.moduleStore.displayedBoardWidth}}
            >
          <Board store={this.moduleStore}/>
            </div>
        </div>
        <SideBar store={this.moduleStore}/>
      </main>
    );
  }

  @onResize
  private handleResize() {
    if (this.containerRef.current === null) { return; }
    const boardWidth = this.containerRef.current.clientWidth - sideBarContainerStyle.width - sideBarContainerStyle.marginLeft;
    this.moduleStore.displayedBoardWidth = boardWidth;
  }
}
