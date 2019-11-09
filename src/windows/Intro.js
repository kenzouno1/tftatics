/*global overwolf*/
import React, { Component } from "react";
import WindowNames from "../common/constants/window-names";
import WindowsService from "../common/services/windows-service";
// Components

class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.dragWindow = this.dragWindow.bind(this);
    this.hideWindow = this.hideWindow.bind(this);
  }

  componentDidMount() {
    console.log("Intro mounted!");
  }

  hideWindow() {
    overwolf.games.getRunningGameInfo(function(result) {
      console.log(JSON.stringify(result));
      if (
        result.title === "League of Legends" ||
        result.id === 54267 ||
        result.classId === 5426
      ) {
        console.log("TFT is running, hiding intro");
        WindowsService.hide(WindowNames.INTRO);
      } else {
        overwolf.windows.getWindowState("ingame", function(result) {
          if (result.status === "success") {
            if (
              result.window_state === "closed" ||
              result.window_state === "minimized"
            ) {
              console.log("ingame is closed or minimized, closing program");
              WindowsService.close(WindowNames.BACKGROUND);
            } else {
              console.log("ingame is open, hiding intro");
              WindowsService.hide(WindowNames.INTRO);
            }
          } else {
            console.log("message not sent");
          }
        });
      }
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

  render() {
    return (
      <div className="intro">
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
        <header className="app-header" onMouseDown={this.dragWindow}>
          <img
            className="brand"
            src={require("../images/brand.svg")}
            alt="tftactics.gg"
          ></img>
          <div className="app-instructions">
            <div className="instruction-group">
              <a href="overwolf://settings/hotkeys">
                <b>Change Keybinds</b>
              </a>
            </div>
          </div>
          <div className="window-controls-group">
            <button
              className="icon window-control window-control-close"
              id="closeButton"
              onClick={this.hideWindow}
            >
              <svg>
                <use xlinkHref="#window-control_close" />
              </svg>
            </button>
          </div>
        </header>

        <div className="intro-content">
          <h1>Welcome to the tftactics.gg App</h1>
          <h2>Become the Next Little Legend</h2>
          <p>
            The app will automatically launch when you get into a TFT match, so
            feel free to close this window. You can also browse the app's
            database or visit the website by clicking the links below.
          </p>
          <div className="cta">
            <div
              className="home-btn"
              page="ingame"
              onClick={this.props.changeWindow}
            >
              View Database
            </div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://tftactics.gg/"
              className="home-btn"
            >
              Visit Website
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Intro;
