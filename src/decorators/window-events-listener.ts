import * as React from 'react';

export function onResize(target: React.Component, name: string) {
  const originMount = target.componentDidMount;
  let func: () => any;
  // tslint-disable-next-line
  target.componentDidMount = function() {
    func = this[name].bind(this);
    if (originMount !== undefined) { originMount.call(this); }
    func();
    window.addEventListener('resize', func);
  };

  const originUnMount = target.componentWillUnmount;
  target.componentWillUnmount = function() {
    if (originUnMount !== undefined) { originUnMount.call(this); }
    window.removeEventListener('resize', func);
  };
}
