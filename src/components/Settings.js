/*global overwolf*/
import React, { Component } from "react";

export class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      res: "resNormal",
      lang: "en",
      itemsWindow: "enabled",
      rollingWindow: "enabled",
      trackerWindow: "enabled",
      onlyPin: false,
      appVersion: ""
    };
    this.changeRes = this.changeRes.bind(this);
    this.changeLang = this.changeLang.bind(this);
    this.toggleItemsWindow = this.toggleItemsWindow.bind(this);
    this.toggleRollingWindow = this.toggleRollingWindow.bind(this);
    this.toggleTrackerWindow = this.toggleTrackerWindow.bind(this);
    this.fullTracker = this.fullTracker.bind(this);
    this.onlyPin = this.onlyPin.bind(this);
  }

  changeRes(e) {
    var resValue = e.currentTarget.attributes.resolution.value;
    overwolf.windows.sendMessage("background", "res", resValue, function(
      response
    ) {
      if (response.status === "error") {
        console.log("Res Message Failed!");
      } else if (response.status === "success") {
        console.log("Res Message Sent:" + resValue);
      }
    });
    this.setState({
      res: resValue
    });
  }

  changeLang(e) {
    var lang = e.currentTarget.attributes.lang.value;
    overwolf.windows.sendMessage("background", "lang", lang, function(
      response
    ) {
      if (response.status === "error") {
        console.log("Language Message Failed!");
      } else if (response.status === "success") {
        console.log("Language Message Sent:" + lang);
      }
    });
    this.setState({
      lang: lang
    });
  }

  fullTracker() {
    overwolf.windows.sendMessage("tracker", "onlyPin", "false", function(
      response
    ) {
      if (response.status === "error") {
        console.log("onlyPin Message Failed!");
      } else if (response.status === "success") {
        console.log("onlyPin Message Sent:");
      }
    });
    localStorage.setItem("onlyPin", "false");
    this.setState({
      onlyPin: false
    });
  }
  onlyPin() {
    overwolf.windows.sendMessage("tracker", "onlyPin", "true", function(
      response
    ) {
      if (response.status === "error") {
        console.log("onlyPin Message Failed!");
      } else if (response.status === "success") {
        console.log("onlyPin Message Sent:");
      }
    });
    localStorage.setItem("onlyPin", "true");
    this.setState({
      onlyPin: true
    });
  }

  toggleItemsWindow() {
    if (this.state.itemsWindow === "enabled") {
      overwolf.windows.obtainDeclaredWindow("windowed", function(result) {
        if (result.status === "success") {
          overwolf.windows.hide(result.window.id);
        }
      });
      localStorage.setItem("itemsWindow", "disabled");
      this.setState({
        itemsWindow: "disabled"
      });
    } else if (this.state.itemsWindow === "disabled") {
      overwolf.windows.obtainDeclaredWindow("windowed", function(result) {
        if (result.status === "success") {
          overwolf.windows.restore(result.window.id);
        }
      });
      localStorage.setItem("itemsWindow", "enabled");
      this.setState({
        itemsWindow: "enabled"
      });
    }
  }

  toggleRollingWindow() {
    if (this.state.rollingWindow === "enabled") {
      overwolf.windows.obtainDeclaredWindow("rolling", function(result) {
        if (result.status === "success") {
          overwolf.windows.hide(result.window.id);
        }
      });
      localStorage.setItem("rollingWindow", "disabled");
      this.setState({
        rollingWindow: "disabled"
      });
    } else if (this.state.rollingWindow === "disabled") {
      overwolf.windows.obtainDeclaredWindow("rolling", function(result) {
        if (result.status === "success") {
          overwolf.windows.restore(result.window.id);
        }
      });
      localStorage.setItem("rollingWindow", "enabled");
      this.setState({
        rollingWindow: "enabled"
      });
    }
  }

  toggleTrackerWindow() {
    if (this.state.trackerWindow === "enabled") {
      overwolf.windows.obtainDeclaredWindow("tracker", function(result) {
        if (result.status === "success") {
          overwolf.windows.hide(result.window.id);
        }
      });
      localStorage.setItem("trackerWindow", "disabled");
      this.setState({
        trackerWindow: "disabled"
      });
    } else if (this.state.trackerWindow === "disabled") {
      overwolf.windows.obtainDeclaredWindow("tracker", function(result) {
        if (result.status === "success") {
          overwolf.windows.restore(result.window.id);
        }
      });
      localStorage.setItem("trackerWindow", "enabled");
      this.setState({
        trackerWindow: "enabled"
      });
    }
  }

  componentDidMount() {
    var windowData = overwolf.windows.getMainWindow();
    var _this = this;

    if ("itemsWindow" in windowData.localStorage) {
      _this.setState({
        itemsWindow: windowData.localStorage.itemsWindow
      });
    } else {
      localStorage.setItem("itemsWindow", "enabled");
    }

    if ("rollingWindow" in windowData.localStorage) {
      _this.setState({
        rollingWindow: windowData.localStorage.rollingWindow
      });
    } else {
      localStorage.setItem("rollingWindow", "enabled");
    }

    if ("trackerWindow" in windowData.localStorage) {
      _this.setState({
        trackerWindow: windowData.localStorage.trackerWindow
      });
    } else {
      localStorage.setItem("trackerWindow", "enabled");
    }

    if ("res" in windowData.localStorage) {
      _this.setState({
        res: windowData.localStorage.res
      });
    }

    if ("lang" in windowData.localStorage) {
      _this.setState({
        lang: windowData.localStorage.lang
      });
    }

    if ("onlyPin" in windowData.localStorage) {
      _this.setState({
        onlyPin: JSON.parse(windowData.localStorage.onlyPin)
      });
    } else {
      localStorage.setItem("onlyPin", "false");
    }

    overwolf.extensions.current.getManifest(function(app) {
      _this.setState({
        appVersion: app.meta.version
      });
    });
  }

  render() {
    return (
      <main className="settings">
        <div className="sidebar">
          <div className="sidebar-navigation">
            <div
              className={
                "characters-category" +
                (this.props.settingsPage === "settings" ? " active" : "")
              }
              page={"settings"}
              settings={"settings"}
              onClick={this.props.setSettingsPage}
            >
              <h3>{this.props.lang === "en" ? "Settings" : "设置"}</h3>
              <img
                src={require("../images/nav/nav-arrow.svg")}
                alt="Arrow"
              ></img>
            </div>
            {/* <div className={"characters-category" + (this.state.tier === 'Origins' ? ' active' : '')} category={'Origins'} onClick={this.setCategory}>
                            <h3>Subscription</h3>
                            <img src={require('../images/nav/nav-arrow.svg')} alt="Arrow"></img>
                        </div> */}
            <div
              className={
                "characters-category" +
                (this.props.settingsPage === "contact" ? " active" : "")
              }
              page={"settings"}
              settings={"contact"}
              onClick={this.props.setSettingsPage}
            >
              <h3>{this.props.lang === "en" ? "Contact" : "联系"}</h3>
              <img
                src={require("../images/nav/nav-arrow.svg")}
                alt="Arrow"
              ></img>
            </div>
          </div>
        </div>

        <div className="main main-wrapper">
          <div className="header-wrapper">
            <h1>
              {this.props.settingsPage[0].toUpperCase() +
                this.props.settingsPage.slice(1)}
            </h1>
            <h4>Version {this.state.appVersion}</h4>
          </div>
          {this.props.settingsPage === "settings" ? (
            <React.Fragment>
              <div className="settings-group">
                <h4>{this.state.lang === "en" ? "Windows" : "窗口"}</h4>
                <div
                  className={
                    "settings-item" +
                    (this.state.itemsWindow === "enabled" ? " active" : "")
                  }
                >
                  <div
                    className="settings-checkbox"
                    onClick={this.toggleItemsWindow}
                  >
                    <img
                      className="settings-check"
                      src={require("../images/ui/icon-check.svg")}
                      alt="Check"
                    ></img>
                  </div>
                  {this.state.lang === "en" ? "Item Cheatsheet" : "装备备忘录"}
                </div>
                <div
                  className={
                    "settings-item" +
                    (this.state.rollingWindow === "enabled" ? " active" : "")
                  }
                >
                  <div
                    className="settings-checkbox"
                    onClick={this.toggleRollingWindow}
                  >
                    <img
                      className="settings-check"
                      src={require("../images/ui/icon-check.svg")}
                      alt="Check"
                    ></img>
                  </div>
                  {this.state.lang === "en" ? "Rolling Chance" : "抽卡几率"}
                </div>
                <div
                  className={
                    "settings-item" +
                    (this.state.trackerWindow === "enabled" ? " active" : "")
                  }
                >
                  <div
                    className="settings-checkbox"
                    onClick={this.toggleTrackerWindow}
                  >
                    <img
                      className="settings-check"
                      src={require("../images/ui/icon-check.svg")}
                      alt="Check"
                    ></img>
                  </div>
                  {this.state.lang === "en" ? "Team Tracker" : "球队"}
                </div>
              </div>
              <div className="settings-group">
                <h4>{this.state.lang === "en" ? "Scale" : "缩放"}</h4>
                <div
                  className={
                    "settings-item" +
                    (this.state.res === "resNormal" ? " active" : "")
                  }
                >
                  <div
                    className="settings-checkbox"
                    resolution="resNormal"
                    onClick={this.changeRes}
                  >
                    <img
                      className="settings-check"
                      src={require("../images/ui/icon-check.svg")}
                      alt="Check"
                    ></img>
                  </div>
                  100%
                </div>
                <div
                  className={
                    "settings-item" +
                    (this.state.res === "resSmall" ? " active" : "")
                  }
                >
                  <div
                    className="settings-checkbox"
                    resolution="resSmall"
                    onClick={this.changeRes}
                  >
                    <img
                      className="settings-check"
                      src={require("../images/ui/icon-check.svg")}
                      alt="Check"
                    ></img>
                  </div>
                  75%
                </div>
              </div>
              <div className="settings-group">
                <h4>{this.state.lang === "en" ? "Language" : "语言"}</h4>
                <div
                  className={
                    "settings-item" +
                    (this.state.lang === "en" ? " active" : "")
                  }
                >
                  <div
                    className="settings-checkbox"
                    lang="en"
                    onClick={this.changeLang}
                  >
                    <img
                      className="settings-check"
                      src={require("../images/ui/icon-check.svg")}
                      alt="Check"
                    ></img>
                  </div>
                  English
                </div>
                <div
                  className={
                    "settings-item" +
                    (this.state.lang === "ch" ? " active" : "")
                  }
                >
                  <div
                    className="settings-checkbox"
                    lang="ch"
                    onClick={this.changeLang}
                  >
                    <img
                      className="settings-check"
                      src={require("../images/ui/icon-check.svg")}
                      alt="Check"
                    ></img>
                  </div>
                  Chinese
                </div>
              </div>
              <div className="settings-group">
                <h4>{this.state.lang === "en" ? "Team Tracker" : "球队"}</h4>
                <div
                  className={
                    "settings-item" + (!this.state.onlyPin ? " active" : "")
                  }
                >
                  <div
                    className="settings-checkbox"
                    lang="en"
                    onClick={this.fullTracker}
                  >
                    <img
                      className="settings-check"
                      src={require("../images/ui/icon-check.svg")}
                      alt="Check"
                    ></img>
                  </div>
                  {this.state.lang === "en"
                    ? "Real-time Board + Pinned Team Comp"
                    : "实时板+决赛团队"}
                </div>
                <div
                  className={
                    "settings-item" + (this.state.onlyPin ? " active" : "")
                  }
                >
                  <div
                    className="settings-checkbox"
                    lang="ch"
                    onClick={this.onlyPin}
                  >
                    <img
                      className="settings-check"
                      src={require("../images/ui/icon-check.svg")}
                      alt="Check"
                    ></img>
                  </div>
                  {this.state.lang === "en"
                    ? "Only Pinned Team Comp"
                    : "仅决赛队伍"}
                </div>
              </div>
            </React.Fragment>
          ) : null}
          {this.props.settingsPage === "subscription" ? null : null}
          {this.props.settingsPage === "contact" ? (
            <React.Fragment>
              <p>
                {this.state.lang === "en"
                  ? "If you would like to request a feature, report a bug, or share feedback, please feel free to send me a message. Business inquiries as well. I try to respond to all of them within the week."
                  : "如果您想要请求功能、报告错误或共享反馈，请随时向我发送消息。还有商务咨询。我尽量在一周内回复这些。"}
              </p>
              <div className="settings-group">
                <h4>
                  {this.state.lang === "en" ? "Contact Info" : "以下是联系方式"}
                </h4>
                <ul className="settings-list">
                  <li className="settings-list-item">
                    <span>Email:</span>hello.tftactics@gmail.com
                  </li>
                  <li className="settings-list-item">
                    <span>Reddit:</span>u/itsjjps
                  </li>
                  <li className="settings-list-item">
                    <span>Discord:</span>jjps#5847
                  </li>
                </ul>
              </div>
            </React.Fragment>
          ) : null}
        </div>
      </main>
    );
  }
}
