/*global overwolf*/
import React, { Component } from "react";

class Notice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patchVer: ""
    };
    this.openDatabase = this.openDatabase.bind(this);
  }

  componentDidMount() {
    console.log("Rolling mounted!");
    var windowData = overwolf.windows.getMainWindow();
    var _this = this;

    if ("patchVer" in windowData.localStorage) {
      _this.setState({
        patchVer: windowData.localStorage.patchVer
      });
    }

    setTimeout(function() {
      overwolf.windows.obtainDeclaredWindow("notice", function(result) {
        if (result.status === "success") {
          overwolf.windows.hide(result.window.id);
        }
      });
    }, 5000);
  }

  openDatabase() {
    overwolf.windows.sendMessage("ingame", "notice", "true", function(
      response
    ) {
      if (response.status === "error") {
        console.log("Page message failed!");
      } else if (response.status === "success") {
        console.log("Page message sent!");
      }
    });
    overwolf.windows.obtainDeclaredWindow("ingame", function(result) {
      if (result.status === "success") {
        overwolf.windows.restore(result.window.id);
      }
    });
    overwolf.windows.obtainDeclaredWindow("notice", function(result) {
      if (result.status === "success") {
        overwolf.windows.hide(result.window.id);
      }
    });
  }

  render() {
    return (
      <div className="notice" onClick={this.openDatabase}>
        <div className="notice-header">
          <img
            className="brand"
            src={require("../images/brand-sm.svg")}
            alt="tftactics.gg"
          ></img>
          Updated to <span>Patch {this.state.patchVer}</span>
        </div>
        <div className="notice-link">Read Notes</div>
      </div>
    );
  }
}

export default Notice;
