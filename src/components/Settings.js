/*global overwolf*/
import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      res: "resNormal",
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
    this.props.i18n.changeLanguage(lang);
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
      this.props.i18n.changeLanguage(windowData.localStorage.lang);
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
    const { t } = this.props;

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
              <h3>{t("Settings")}</h3>
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
              <h3>{t("Contact")}</h3>
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
                <h4>{t("Windows")}</h4>
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
                  {t("Item Cheatsheet")}
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
                  {t("Rolling Chance")}
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
                  {t("Team Tracker")}
                </div>
              </div>
              <div className="settings-group">
                <h4>{t("Scale")}</h4>
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
                <h4>{t("Language")}</h4>
                <div
                  className={
                    "settings-item" +
                    (this.props.i18n.language === "en" ? " active" : "")
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
                    (this.props.i18n.language === "ch" ? " active" : "")
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
                <div
                  className={
                    "settings-item" +
                    (this.props.i18n.language === "vi" ? " active" : "")
                  }
                >
                  <div
                    className="settings-checkbox"
                    lang="vi"
                    onClick={this.changeLang}
                  >
                    <img
                      className="settings-check"
                      src={require("../images/ui/icon-check.svg")}
                      alt="Check"
                    ></img>
                  </div>
                  Tiếng Việt
                </div>
              </div>
              <div className="settings-group">
                <h4>{t("Team Tracker")}</h4>
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
                  {t("Real-time Board + Pinned Team Comp")}
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
                  {t("Only Pinned Team Comp")}
                </div>
              </div>
            </React.Fragment>
          ) : null}
          {this.props.settingsPage === "subscription" ? null : null}
          {this.props.settingsPage === "contact" ? (
            <React.Fragment>
              <p>
                {t(
                  "If you would like to request a feature, report a bug, or share feedback, please feel free to send me a message. Business inquiries as well. I try to respond to all of them within the week."
                )}
              </p>
              <div className="settings-group">
                <h4>{t("Contact Info")}</h4>
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
export default withTranslation()(Settings);
