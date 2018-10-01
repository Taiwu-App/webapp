import * as React from 'react';

import Board from './board';
import SideBar from './side-bar';
import './style.less';

export default class VillageBuildings extends React.Component {
  public render(){
    return (
      <main className="main-content build-plan__container">
        <div className="build-plan__middle-container">
          <Board />
        </div>
        <SideBar />
      </main>
    );
  }
}