import { RedirectProps, RouteProps } from 'react-router-dom';

import About from '../containers/about';
import VillageBuildings from '../containers/village-buildings';

export interface IRouteProps extends RouteProps {
  children?: IRouteProps[];
  text?: string;
}

export const routes: IRouteProps[] = [
  {
    component: About,
    exact: true,
    path: '/about',
    text: '关于'
  },
  {
    component: VillageBuildings,
    exact: true,
    path: '/buildings',
    text: '建筑布局'
  }
];

export const redirects: RedirectProps[] = [
  {
    exact: true,
    from: '/',
    to: '/about'
  }
];
