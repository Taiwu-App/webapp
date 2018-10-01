import 'normalize.css';
import * as React from 'react';

import SideMenu from './containers/side-menu';
import TopHeader from './containers/top-header';
import RouterView from './routers';
import './styles/global.less';

export default class App extends React.Component {
  public render() {
    return (
      <div className="root">
        <TopHeader className="layout__head"/>
        {/* begin of main */}
        <div className="layout__body">
          <SideMenu />
          <main className="main-content">
            <RouterView />
          </main>
        </div>
        {/* end of main */}
      </div>
    );
  }
}
