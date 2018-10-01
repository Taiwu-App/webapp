import * as React from 'react';
import { Redirect ,Route, Switch } from 'react-router';

import { redirects, routes } from './routes';

export default class AppRoutes extends React.Component {
  public render() {
    return (
      <Switch>
        { routes.map((r, idx) => (<Route {...r} key={idx}/>)) }
        { redirects.map((r, idx) => (<Redirect {...r} key={idx} />))}
      </Switch>
    );
  }
}