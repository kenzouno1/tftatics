// Utilities
import React, { Component } from "react";

export class Divider extends Component {
  render() {
    return (
      <div
        className={
          "divider" + (this.props.extraClass ? " " + this.props.extraClass : "")
        }
      ></div>
    );
  }
}
