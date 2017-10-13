import React, { Component } from 'react';
import './App.css';
import Header from '../Header/Header';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
    };
  }

  render() {
    return (
      <div className="App">
        <div style={{ margin: 5 }}>
          <a
            onClick={event => {
              event.preventDefault();
              this.setState({
                show: !this.state.show,
              });
            }}
          >
            toggle to show header
          </a>
        </div>
        <Header show={this.state.show} />
      </div>
    );
  }
}

export default App;
