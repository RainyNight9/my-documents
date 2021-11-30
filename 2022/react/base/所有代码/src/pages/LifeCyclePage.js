import React, { Component } from "react";
// import PropTypes from "prop-types";

export default class LifeCyclePage extends Component {
  static defaultProps = {
    // msg: "omg"
  };
  static propTypes = {
    // msg: PropTypes.string.isRequired
  };
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    console.log("constructor");
  }

  static getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps");
    const { count } = state;
    return count > 5 ? { count: 0 } : null;
  }

  // UNSAFE_componentWillMount() {
  //   console.log("componentWillMount");
  // }

  componentDidMount() {
    console.log("componentDidMount");
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { count } = nextState;
    console.log("shouldComponentUpdate", nextState, this.state);
    return count !== 3;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("getSnapshotBeforeUpdate", prevProps, prevState);
    return {
      msg: "我是getSnapshotBeforeUpdate"
    };
  }

  // UNSAFE_componentWillUpdate() {
  //   console.log("componentWillUpdate");
  // }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("componentDidUpdate", prevProps, prevState, snapshot);
  }
  setCount = () => {
    this.setState({ count: this.state.count + 1 });
  };
  render() {
    console.log("render", this.props);
    const { count } = this.state;
    return (
      <div>
        <h3>LifeCyclePage</h3>
        <p>{count}</p>
        <button onClick={this.setCount}>改变count</button>
        {/* {count % 2 && <Child count={count} />} */}
        <Child count={count} />
      </div>
    );
  }
}

class Child extends Component {
  // 初次渲染的时候不会执行，只有在已挂载的组件接收新的props的时候，才会执行
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   console.log("componentWillReceiveProps", nextProps);
  // }
  componentWillUnmount() {
    console.log("componentWillUnmount");
  }
  render() {
    console.log("Child render");
    const { count } = this.props;
    return (
      <div>
        <h3>Child</h3>
        <p>{count}</p>
      </div>
    );
  }
}
