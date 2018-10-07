import * as React from 'react';

export default function listen(el: HTMLElement | Window, eventName: string) {
  return (target: React.Component, name: string) => {
    const originMount = target.componentDidMount;
    let func: () => any;
    // tslint-disable-next-line
    target.componentDidMount = function() {
      func = this[name].bind(this);
      if (originMount !== undefined) { originMount.call(this); }
      func();
      el.addEventListener(eventName, func);
    };

    const originUnMount = target.componentWillUnmount;
    target.componentWillUnmount = function() {
      if (originUnMount !== undefined) { originUnMount.call(this); }
      el.removeEventListener(eventName, func);
    };
  };
}
