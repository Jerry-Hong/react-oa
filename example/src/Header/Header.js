import React, { PureComponent } from 'react';
import { withTransition, cubicInOut } from 'react-oa';
import logo from './logo.svg';

class Header extends PureComponent {
  render() {
    return (
      <header className="App-header">
        <h1 className="App-title">Welcome to React</h1>
      </header>
    );
  }
}

export default withTransition(
  600,
  { x: 100 },
  { x: 0 },
  ({ x }) => ({
    transform: `translateX(${x}%)`,
  }),
  cubicInOut,
  {
    position: 'absolute',
    width: '100%',
    height: 150,
    willChange: 'transform',
  }
)(Header);
