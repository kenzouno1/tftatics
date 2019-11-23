/*global overwolf*/
import React, { Component } from "react";
// Components
import CharacterPortrait from "../components/CharacterPortrait";
import { withTranslation } from "react-i18next";
class Rolling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        level: 1
      },
      cost: "1",
      showNext: false,
      showChamps: false,
      res: "resNormal",
      timer: null,
      levelTimer: null
    };
    this.hideWindow = this.hideWindow.bind(this);
    this.dragWindow = this.dragWindow.bind(this);
    this.showNext = this.showNext.bind(this);
    this.hideNext = this.hideNext.bind(this);
    this.showChamps = this.showChamps.bind(this);
    this.hideChamps = this.hideChamps.bind(this);
  }

  componentDidMount() {
    console.log("Rolling mounted!");
    var windowData = overwolf.windows.getMainWindow();
    var _this = this;

    if ("gepStatus" in windowData.localStorage) {
      _this.setState({
        gepStatus: windowData.localStorage.gepStatus
      });
      console.log("gepStatus localStorage found!");
    }

    if ("res" in windowData.localStorage) {
      if (windowData.localStorage.res === "resSmall") {
        this.setState({
          res: windowData.localStorage.res
        });
        // Rolling 75
        overwolf.windows.changeSize("rolling", 310, 296, result => {
          if (result.status === "success") {
            console.log(
              "Change Size for rolling: width: " + 310 + " height: " + 296
            );
          }
        });
      } else {
        this.setState({
          res: windowData.localStorage.res
        });
        // Rolling 100
        overwolf.windows.changeSize("rolling", 400, 323, result => {
          if (result.status === "success") {
            console.log(
              "Change Size for rolling: width: " + 400 + " height: " + 323
            );
          }
        });
      }
    } else {
      // Rolling 100
      overwolf.windows.changeSize("rolling", 400, 323, result => {
        if (result.status === "success") {
          console.log(
            "Change Size for rolling: width: " + 400 + " height: " + 323
          );
        }
      });
    }

    overwolf.windows.onMessageReceived.addListener(function(info) {
      if (info.id === "set") {
        console.log("set message received: " + info.content);
        _this.props.updateSet(info.content);
      }
      if (info.id === "chance") {
        console.log("chance message received: " + info.content.info.me.xp);
        _this.setState({
          data: JSON.parse(info.content.info.me.xp)
        });
      }
      if (info.id === "res") {
        console.log("Res Message Received: " + JSON.stringify(info.content));
        _this.setState({
          res: info.content
        });
        switch (info.content) {
          case "resNormal":
            // Rolling 100
            overwolf.windows.changeSize("rolling", 400, 323, result => {
              if (result.status === "success") {
                console.log(
                  "Change Size for rolling: width: " + 400 + " height: " + 323
                );
              }
            });
            break;
          case "resSmall":
            // Rolling 75
            overwolf.windows.changeSize("rolling", 310, 296, result => {
              if (result.status === "success") {
                console.log(
                  "Change Size for rolling: width: " + 310 + " height: " + 296
                );
              }
            });
            break;
          default:
            return null;
        }
      }
    });
  }

  showNext() {
    var _this = this;
    this.setState({
      levelTimer: setTimeout(function() {
        _this.setState({
          showNext: true
        });
      }, 300)
    });
  }

  hideNext() {
    clearTimeout(this.state.levelTimer);
    this.setState({
      showNext: false
    });
  }

  showChamps(e) {
    var targetCost = e.currentTarget.attributes.cost.value;
    var _this = this;
    this.setState({
      timer: setTimeout(function() {
        _this.setState({
          showChamps: true,
          cost: targetCost
        });
      }, 300)
    });
  }

  hideChamps() {
    clearTimeout(this.state.timer);
    this.setState({
      showChamps: false
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
    overwolf.windows.obtainDeclaredWindow("rolling", function(result) {
      if (result.status === "success") {
        overwolf.windows.hide(result.window.id);
      }
    });
  }

  render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <div
          className={
            "rolling-window-champs " +
            this.state.res +
            (this.state.showChamps ? " show" : "")
          }
        >
          <div className="characters-list">
            {Object.keys(this.props.charactersJSON).map(function(key) {
              var character = this.props.charactersJSON[key];
              if (character.active) {
                if (character.set.includes(parseInt(this.props.set))) {
                  if (character.cost + "" === this.state.cost) {
                    return (
                      <CharacterPortrait
                        character={character}
                        key={key}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.i18n.language}
                        set={this.props.set}
                      ></CharacterPortrait>
                    );
                  } else if (
                    character.name === "Cloud Lux" &&
                    this.state.cost === "5"
                  ) {
                    return (
                      <CharacterPortrait
                        character={character}
                        key={key}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.i18n.language}
                        set={this.props.set}
                      ></CharacterPortrait>
                    );
                  }
                }
              }
              return null;
            }, this)}
          </div>
          <div className="characters-cost">
            <h2>
              {this.state.cost === "1"
                ? this.props.set === "1"
                  ? "39"
                  : "29"
                : null}
              {this.state.cost === "2"
                ? this.props.set === "1"
                  ? "26"
                  : "22"
                : null}
              {this.state.cost === "3"
                ? this.props.set === "1"
                  ? "18"
                  : "16"
                : null}
              {this.state.cost === "4"
                ? this.props.set === "1"
                  ? "13"
                  : "12"
                : null}
              {this.state.cost === "5"
                ? this.props.set === "1"
                  ? "10"
                  : "10"
                : null}
            </h2>
            <h4>{t("Tier {{cost}} Champions in pool", this.state.cost)}</h4>
          </div>
        </div>
        <div
          className={
            "rolling-window-next " +
            this.state.res +
            (this.state.showNext ? " show" : "")
          }
        >
          {Object.keys(this.props.rollingJSON).map(function(key) {
            var rollingData = this.props.rollingJSON[key];
            return (
              <div
                className={
                  "rolling-group" +
                  (rollingData.level === this.state.data.level ? " active" : "")
                }
              >
                <div className="rolling-info">{rollingData.level}</div>
                <div className="rolling-list">
                  <div className="rolling-item one">★ {rollingData.tier_1}</div>
                  <div className="rolling-item two">★ {rollingData.tier_2}</div>
                  <div className="rolling-item three">
                    ★ {rollingData.tier_3}
                  </div>
                  <div className="rolling-item four">
                    ★ {rollingData.tier_4}
                  </div>
                  <div className="rolling-item five">
                    ★ {rollingData.tier_5}
                  </div>
                </div>
              </div>
            );
          }, this)}
        </div>
        <div
          className={
            "rolling-window " +
            this.state.res +
            (this.state.showChamps ? " no-m" : "")
          }
          onMouseDown={this.dragWindow}
        >
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
          {Object.keys(this.props.rollingJSON).map(function(key) {
            var rollingData = this.props.rollingJSON[key];
            return rollingData.level === this.state.data.level ? (
              <React.Fragment>
                {this.state.gepStatus !== "3" ? (
                  <div
                    className="rolling-info"
                    onMouseEnter={this.showNext}
                    onMouseLeave={this.hideNext}
                  >
                    {this.state.data.level}
                  </div>
                ) : (
                  <div
                    className="rolling-info icon info"
                    onMouseEnter={this.showNext}
                    onMouseLeave={this.hideNext}
                  >
                    <img
                      src={require("../images/ui/icon-warning.svg")}
                      alt="warning"
                    ></img>
                  </div>
                )}
                <div className="rolling-list">
                  <div
                    className="rolling-item one"
                    cost={"1"}
                    onMouseEnter={this.showChamps}
                    onMouseLeave={this.hideChamps}
                  >
                    ★ {this.state.gepStatus !== "3" ? rollingData.tier_1 : "0%"}
                  </div>
                  <div
                    className="rolling-item two"
                    cost={"2"}
                    onMouseEnter={this.showChamps}
                    onMouseLeave={this.hideChamps}
                  >
                    ★ {this.state.gepStatus !== "3" ? rollingData.tier_2 : "0%"}
                  </div>
                  <div
                    className="rolling-item three"
                    cost={"3"}
                    onMouseEnter={this.showChamps}
                    onMouseLeave={this.hideChamps}
                  >
                    ★ {this.state.gepStatus !== "3" ? rollingData.tier_3 : "0%"}
                  </div>
                  <div
                    className="rolling-item four"
                    cost={"4"}
                    onMouseEnter={this.showChamps}
                    onMouseLeave={this.hideChamps}
                  >
                    ★ {this.state.gepStatus !== "3" ? rollingData.tier_4 : "0%"}
                  </div>
                  <div
                    className="rolling-item five"
                    cost={"5"}
                    onMouseEnter={this.showChamps}
                    onMouseLeave={this.hideChamps}
                  >
                    ★ {this.state.gepStatus !== "3" ? rollingData.tier_5 : "0%"}
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
              </React.Fragment>
            ) : null;
          }, this)}
        </div>
      </React.Fragment>
    );
  }
}

export default withTranslation()(Rolling);
