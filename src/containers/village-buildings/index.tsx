import { History } from 'history';
import { observer } from 'mobx-react';
import * as React from 'react';

import BaseButton from '@/components/buttons/base';
import bindthis from '@/decorators/bindthis';
import listen from '@/decorators/events-listener';
import Board from './board';
import DetailInfo from './detail-info';
import SideBar, { containerStyle as sideBarContainerStyle } from './side-bar';
import ModuleStore from './stores';
import './style.less';

interface IProps extends History {
  history: any;
}

@observer
export default class VillageBuildings extends React.Component<IProps> {
  private readonly containerRef: React.RefObject<HTMLMainElement> = React.createRef();
  private readonly moduleStore: ModuleStore = new ModuleStore();
  constructor(props: any) {
    super(props);
    this.state = {
      boardWidth: 0,
      handleResize: this.handleResize
    };
  }

  public componentDidMount() {
    this.recoverFromToken();

  }
  public componentDidUpdate(prevProps: History) {
    if (this.props.location !== prevProps.location) {
      this.recoverFromToken();
    }
  }
  private recoverFromToken() {
    const token = this.props.location.search.slice(1);
    if (token === '') { return; }
    const isSuccess = this.moduleStore.boardStore.recoverFromToken(token);
    if (!isSuccess) {
      alert('token格式不正确');
      this.props.history.push('buildings');
    }
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
            {
              this.moduleStore.tipsMessage !== '' ? (
                <h4 className="build-plan__tips-content build-plan__tips_content--right">
                  Tips: {this.moduleStore.tipsMessage}
                </h4>
              ) : (
                <div>
                  <BaseButton
                    className="build-plan__tips-button build-plan__tips-button--save"
                    onClick={this.handleSave}
                  >
                    保存布局
                  </BaseButton>
                  <BaseButton
                    className="build-plan__tips-button build-plan__tips-button--clear"
                    onClick={this.handleClear}
                    type="warning"
                  >
                    清空布局
                  </BaseButton>
                </div>
              )
            }
          </article>
          <div
            className="build-plan__board-frame"
            style={{width: this.moduleStore.displayedBoardWidth}}
          >
            <Board store={this.moduleStore}/>
          </div>
        </div>
        <SideBar store={this.moduleStore}/>
        <DetailInfo info={this.moduleStore.hoveredPlaceholder}/>
      </main>
    );
  }

  @listen(window, 'resize') private handleResize() {
    if (this.containerRef.current === null) { return; }
    const boardWidth = this.containerRef.current.clientWidth - sideBarContainerStyle.width - sideBarContainerStyle.marginLeft;
    this.moduleStore.sideBarStore.barHeight = this.containerRef.current.clientHeight;
    this.moduleStore.displayedBoardWidth = boardWidth;
  }

  @bindthis private handleSave(): void {
    const token = this.moduleStore.boardStore.map.asBase64;
    this.props.history.push(`buildings?${token}`);
    alert('已保存, 复制链接地址即可');
  }
  @bindthis private handleClear() {
    this.moduleStore.boardStore.recoverFromToken('');
  }
}
