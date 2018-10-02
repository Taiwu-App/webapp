import * as React from 'react';

import SideMenuComp from './component';

export interface ISideMenuProp {
  className?: string;
}

export default class SideMenu extends React.Component<ISideMenuProp> {
  public static defaultProps: ISideMenuProp = {
    className: ''
  };
  
  constructor(props: any) {
    super(props);
  }
  
  public render() {
    return (<SideMenuComp />);
  }
}