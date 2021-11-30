import React, { Component } from "react";

export default class ClassComponent extends Component {
  constructor(props) {
    super(props);
    //存储状态
    this.state = {
      date: new Date()
    };
  }
  //组件挂载完成之后执行
  componentDidMount() {
    this.timer = setInterval(() => {
      //更新state，不能用this.state
      this.setState({
        date: new Date()
      });
    }, 1000);
  }
  //组件卸载之前执行
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    const { date } = this.state;
    return (
      <div>
        <h3>ClassConponent</h3>
        <p>{date.toLocaleTimeString()}</p>
      </div>
    );
  }
}
