import React, { Component, PureComponent } from "react";

export default class PureComponentPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
      // obj: { num: 0 }
    };
  }
  setCount = () => {
    this.setState({
      count: 100
      //, obj: { num: 1000 }
    });
  };
  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextState.count !== this.state.count;
  // }
  render() {
    console.log("render");
    const { count } = this.state;
    return (
      <div>
        <h3>PureComponentPage</h3>
        <button onClick={this.setCount}>{count}</button>
      </div>
    );
  }
}
