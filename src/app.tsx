import 'normalize.css';
import * as React from 'react';

import './assets/css/global.less';
import SideMenu from './containers/side-menu';
import TopHeader from './containers/top-header';
import RouterView from './routers';

export default class App extends React.Component {
  public render() {
    return (
      <div className="root">
        <TopHeader className="layout__head"/>
        {/* begin of main */}
        <div className="layout__body">
          <SideMenu />
          <RouterView />
        </div>
        {/* end of main */}
      </div>
    );
  }
}
