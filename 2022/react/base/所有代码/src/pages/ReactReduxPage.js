import React, { Component } from "react";
import { connect } from "react-redux";

export default connect(
  //mapStateToProps 把state映射到props
  state => ({ num: state }),

  //mapDispatchToProps 把dispatch映射到props
  {
    add: () => ({ type: "ADD" })
  }
)(
  class ReactReduxPage extends Component {
    render() {
      const { num, dispatch, add } = this.props;
      console.log("props", this.props);
      return (
        <div>
          <h3>ReactReduxPage</h3>
          <p>{num}</p>
          {/* <button onClick={() => dispatch({ type: "ADD" })}>add</button> */}
          <button onClick={add}>add</button>
        </div>
      );
    }
  }
);
