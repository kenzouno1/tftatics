/*global overwolf*/
import React, { Component } from "react";
// Components
import { ItemPortrait } from "../components/ItemPortrait";

class Windowed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hotkey: "",
      toggle: "",
      item: "",
      saved: "",
      scale: false,
      locked: false,
      res: "resNormal",
      lang: "en",
      levelTimer: null
    };
    this.hideWindow = this.hideWindow.bind(this);
    this.dragWindow = this.dragWindow.bind(this);
    this.resizeWindow = this.resizeWindow.bind(this);
    this.stopResize = this.stopResize.bind(this);
    this.setItem = this.setItem.bind(this);
    this.clearItem = this.clearItem.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.clearTimer = this.clearTimer.bind(this);
  }

  hideWindow() {
    overwolf.windows.obtainDeclaredWindow("windowed", function(result) {
      if (result.status === "success") {
        overwolf.windows.hide(result.window.id);
      }
    });
  }

  componentDidMount() {
    console.log("Windowed mounted!");
    var _this = this;
    var windowData = overwolf.windows.getMainWindow();

    if ("lang" in windowData.localStorage) {
      _this.setState({
        lang: windowData.localStorage.lang
      });
    }

    if ("res" in windowData.localStorage) {
      _this.setState({
        res: windowData.localStorage.res
      });
    }

    overwolf.windows.changeSize("windowed", 500, 650, result => {
      if (result.status === "success") {
        console.log(
          "Change Size for windowed: width: " + 500 + " height: " + 650
        );
      }
    });

    // Listener for Resolution Changes
    overwolf.windows.onMessageReceived.addListener(function(info) {
      if (info.id === "set") {
        console.log("set message received: " + info.content);
        _this.props.updateSet(info.content);
      }
      if (info.id === "res") {
        console.log("Res Message Received: " + JSON.stringify(info.content));
        _this.setState({
          res: info.content
        });
      }
      if (info.id === "lang") {
        console.log("Lang Message Received: " + JSON.stringify(info.content));
        _this.setState({
          lang: info.content
        });
      }
    });

    overwolf.settings.getHotKey("toggleWindows", result => {
      _this.setState({
        hotkey: result.hotkey
      });
    });
    overwolf.settings.getHotKey("toggleDatabase", result => {
      _this.setState({
        toggle: result.hotkey
      });
    });
    overwolf.settings.OnHotKeyChanged.addListener(result => {
      if (result.source === "toggleWindows") {
        _this.setState({
          hotkey: result.hotkey
        });
      } else if (result.source === "toggleDatabase") {
        _this.setState({
          toggle: result.hotkey
        });
      }
    });
    overwolf.windows.getWindowDPI(function(result) {
      if (result.scale > 1) {
        console.log(
          "scale is bigger than 1" + result.scale + " " + typeof result.scale
        );
        _this.setState({
          scale: true
        });
      } else {
        console.log(
          "scale is 1 or less: " + result.scale + " " + typeof result.scale
        );
        _this.setState({
          scale: false
        });
      }
    });
  }

  // TFT
  // Overwolf
  dragWindow() {
    overwolf.windows.getCurrentWindow(function(result) {
      if (result.status === "success") {
        overwolf.windows.dragMove(result.window.id);
      }
    });
  }

  resizeWindow(e) {
    this.setState({
      item: e.currentTarget.attributes.name.value,
      locked: true
    });
    overwolf.windows.getCurrentWindow(function(result) {
      if (result.status === "success") {
        overwolf.windows.dragResize(result.window.id, "BottomRight");
      }
    });
  }

  stopResize() {
    this.setState({
      locked: false
    });
  }

  setItem(e) {
    var _this = this;
    var targetItem = e.currentTarget.attributes.name.value;
    if (this.state.saved === "") {
      this.setState({
        showTimer: setTimeout(function() {
          _this.setState({
            item: targetItem
          });
        }, 300)
      });
    }
  }

  clearTimer() {
    clearTimeout(this.state.showTimer);
  }

  clearItem() {
    clearTimeout(this.state.showTimer);
    if (this.state.locked === false) {
      this.setState({
        item: "",
        saved: ""
      });
    }
  }

  saveItem(e) {
    if (this.state.saved !== e.currentTarget.attributes.name.value) {
      this.setState({
        item: e.currentTarget.attributes.name.value,
        saved: e.currentTarget.attributes.name.value
      });
    } else {
      this.setState({
        item: "",
        saved: ""
      });
    }
  }

  render() {
    // Filter Data
    let itemsBase = [];
    Object.keys(this.props.itemsJSON).map(function(key) {
      var item = this.props.itemsJSON[key];
      return item.into && item.set.includes(parseInt(this.props.set))
        ? itemsBase.push(item)
        : null;
    }, this);
    return (
      <div
        className={"windowed " + this.state.res}
        onMouseLeave={this.clearItem}
        onMouseEnter={this.stopResize}
      >
        <svg xmlns="http://www.w3.org/2000/svg" display="none">
          <symbol id="window-control_maximize" viewBox="0 0 30 30">
            <rect
              x="10.5"
              y="10.5"
              width="9"
              height="9"
              fill="none"
              stroke="currentcolor"
            />
          </symbol>
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
        {this.state.scale ? (
          <img
            src={require("../images/resize-icon.svg")}
            alt="resize window"
            onMouseDown={this.resizeWindow}
            className="window-resize"
            style={{
              position: "absolute",
              userSelect: "none",
              width: "20px",
              height: "20px",
              right: "0px",
              bottom: "0px",
              cursor: "nw-resize"
            }}
            name="B.F. Sword"
          ></img>
        ) : null}
        {this.state.item !== "" ? (
          <div className="combo-list">
            {Object.keys(itemsBase).map(function(key) {
              var item = itemsBase[key];
              return (
                <div className="combo-list-row">
                  <div className="combo-list-item">
                    <img
                      className="combo-list-icon"
                      src={
                        "https://rerollcdn.com/items/" +
                        this.state.item
                          .replace(/ /g, "")
                          .replace(/\./g, "")
                          .replace(/'/g, "") +
                        ".png"
                      }
                      alt={this.state.item}
                    ></img>
                  </div>
                  +
                  <div className="combo-list-item">
                    <img
                      className="combo-list-icon"
                      src={
                        "https://rerollcdn.com/items/" +
                        item.name
                          .replace(/ /g, "")
                          .replace(/\./g, "")
                          .replace(/'/g, "") +
                        ".png"
                      }
                      alt={item.name}
                    ></img>
                  </div>
                  =
                  {Object.keys(this.props.itemsJSON).map(function(key) {
                    var finalItem = this.props.itemsJSON[key];
                    return finalItem.combine &&
                      finalItem.set.includes(parseInt(this.props.set)) ? (
                      (finalItem.combine[0] === this.state.item &&
                        finalItem.combine[1] === item.name) ||
                      (finalItem.combine[1] === this.state.item &&
                        finalItem.combine[0] === item.name) ? (
                        <div className="combo-list-item">
                          <ItemPortrait
                            item={finalItem}
                            builder={true}
                            simple={true}
                            res={this.state.res}
                            patchJSON={this.props.patchJSON}
                            pos={"right"}
                            window={"windowed-overlay"}
                            lang={this.state.lang}
                          ></ItemPortrait>
                        </div>
                      ) : null
                    ) : null;
                  }, this)}
                </div>
              );
            }, this)}
          </div>
        ) : null}

        <header className="app-header" onMouseDown={this.dragWindow}>
          <img
            className="brand"
            src={require("../images/brand.svg")}
            alt="tftactics.gg"
          ></img>
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

        <main className="item-builder">
          <div className="main">
            <div className="characters-list">
              {Object.keys(itemsBase).map(function(key) {
                var item = itemsBase[key];
                return (
                  <div className="characters-item">
                    <img
                      className={
                        "windowed-items" +
                        (this.state.saved === item.name ? " selected" : "")
                      }
                      src={
                        "https://rerollcdn.com/items/" +
                        item.name
                          .replace(/ /g, "")
                          .replace(/\./g, "")
                          .replace(/'/g, "") +
                        ".png"
                      }
                      alt={item.name}
                      name={item.name}
                      onMouseEnter={this.setItem}
                      onMouseLeave={this.clearTimer}
                      onClick={this.saveItem}
                    ></img>
                  </div>
                );
              }, this)}
            </div>
            <div
              className="btn"
              page="ingame"
              onClick={this.props.changeWindow}
            >
              Open Database <b>({this.state.toggle})</b>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Windowed;
