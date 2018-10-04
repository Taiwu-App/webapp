import { observer } from 'mobx-react';
import * as React from 'react';

import bindthis from '@/decorators/bindthis';
import { attachResizeListener, IDynamicSize } from '@/decorators/window-events-listener';
import Board from './board';
import SideBar, { containerStyle as sideBarContainerStyle } from './side-bar';
import ModuleStore from './stores';
import './style.less';

export interface IVillageBuildingsState extends IDynamicSize {
  boardWidth: number;
}

@observer
class VillageBuildings extends React.Component<{}, IVillageBuildingsState> {
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
        <div
          className="build-plan__middle-container"
          style={{maxWidth: this.state.boardWidth}}
        >
          <Board store={this.moduleStore.boardStore}/>
        </div>
        <SideBar store={this.moduleStore}/>
      </main>
    );
  }

  @bindthis
  private handleResize() {
    if (this.containerRef.current === null) { return; }
    this.setState({
      ...this.state,
      boardWidth: this.containerRef.current.clientWidth - sideBarContainerStyle.width - sideBarContainerStyle.marginLeft
    });
  }
}

export default attachResizeListener(VillageBuildings);
