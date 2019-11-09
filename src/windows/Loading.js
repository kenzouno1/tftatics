/*global overwolf*/
/*global OwAd*/
import React, { Component } from "react";
import WindowsService from "../common/services/windows-service";
import WindowNames from "../common/constants/window-names";

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phase: "loading",
      hotkey: ""
    };
    this.dragWindow = this.dragWindow.bind(this);
    this.closeAd = this.closeAd.bind(this);
    this.hideWindow = this.hideWindow.bind(this);
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://content.overwolf.com/libs/ads/latest/owads.min.js";
    script.async = true;
    script.onload = function() {
      const owAdLoading = new OwAd(document.getElementById("ad-loading"));
      overwolf.windows.onStateChanged.addListener(function(info) {
        console.log("Window state changed: " + JSON.stringify(info));
        if (
          info.window_state === "minimized" &&
          info.window_name === "loading"
        ) {
          console.log("loading ad is getting removed");
          owAdLoading.removeAd();
        } else if (
          info.window_previous_state === "minimized" &&
          info.window_state === "normal" &&
          info.window_name === "loading"
        ) {
          console.log("loading ad is getting refreshed");
          owAdLoading.refreshAd();
        }
      });
    };
    document.body.appendChild(script);

    overwolf.settings.getHotKey("toggleWindows", result => {
      this.setState({
        hotkey: result.hotkey
      });
    });
    overwolf.settings.OnHotKeyChanged.addListener(result => {
      if (result.source === "toggleWindows") {
        this.setState({
          hotkey: result.hotkey
        });
      }
    });

    var _this = this;
    overwolf.windows.onMessageReceived.addListener(function(info) {
      console.log(
        "onMessageReceived: " + typeof info.content + " " + info.content
      );
      _this.setState({
        phase: info.content
      });
    });
  }

  // Overwold
  dragWindow() {
    overwolf.windows.getCurrentWindow(function(result) {
      if (result.status === "success") {
        overwolf.windows.dragMove(result.window.id);
      }
    });
  }

  hideWindow() {
    overwolf.windows.obtainDeclaredWindow("loading", function(result) {
      if (result.status === "success") {
        overwolf.windows.hide(result.window.id);
      }
    });
  }

  closeAd() {
    if (localStorage.getItem("itemsWindow") === "enabled") {
      WindowsService.restore(WindowNames.WINDOWED);
    }
    if (localStorage.getItem("rollingWindow") === "enabled") {
      WindowsService.restore(WindowNames.ROLLING);
    }
    if (localStorage.getItem("trackerWindow") === "enabled") {
      WindowsService.restore(WindowNames.TRACKER);
    }
    WindowsService.hide(WindowNames.LOADING);
  }

  render() {
    return (
      <div className="loading-window" onMouseDown={this.dragWindow}>
        <svg xmlns="http://www.w3.org/2000/svg" display="none">
          <symbol id="window-control_close" viewBox="0 0 30 30">
            <line
              x1="19.5"
              y1="10.5"
              x2="10.5"
              y2="19.5"
              fill="none"
              stroke="currentcolor"
              strokeLinecap="round"
            />
            <line
              x1="10.5"
              y1="10.5"
              x2="19.5"
              y2="19.5"
              fill="none"
              stroke="currentcolor"
              strokeLinecap="round"
            />
          </symbol>
        </svg>
        <div className="loading-window-content">
          <div className="window-controls-group">
            <button
              className="icon window-control window-control-close"
              id="closeButton"
              onClick={
                this.state.phase === "ready" ? this.closeAd : this.hideWindow
              }
            >
              <svg>
                <use xlinkHref="#window-control_close" />
              </svg>
            </button>
          </div>
          <img src={require("../images/brand-sm.svg")} alt="tftactics"></img>
          <h2>
            {this.state.phase === "ready"
              ? "TFTactics is ready!"
              : "TFTactics is getting ready..."}
          </h2>
          {this.state.phase === "ready" ? (
            <div className="loading-instructions">
              <div className="home-btn" onClick={this.closeAd}>
                Get Started
              </div>
              or press <b>{this.state.hotkey}</b>
            </div>
          ) : null}
        </div>
        <div id="ad-loading" className="ow-ad"></div>
      </div>
    );
  }
}

export default Loading;
