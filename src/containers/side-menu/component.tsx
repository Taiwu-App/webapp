import * as React from 'react';
import { NavLink } from 'react-router-dom';

import { Menu, MenuItem } from '@/components/menu';
import { IRouteProps, routes } from '@/routers/routes';
import './style.less';


export default class SideMenuComponent extends React.Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <nav className="side-menu">
        <Menu className="side-menu__list">
          { routes.map(this.renderMenuItem) }
          {/* <MenuItem className="side-menu__item clickable">
            关于
          </MenuItem>
          <MenuItem className="side-menu__item clickable">
            建筑布局
          </MenuItem> */}
        </Menu>
      </nav>
    );
  }

  private renderMenuItem(config: IRouteProps, idx: number): React.ReactNode {
    let label = config.text;
    if (label === undefined) { label = 'Error'; }
    return (
      <MenuItem key={idx}>
        <NavLink
          to={config.path!}
          className="side-menu__item clickable"
          activeClassName="active"
        >
          {label}
        </NavLink>
      </MenuItem>
    );
  }
}