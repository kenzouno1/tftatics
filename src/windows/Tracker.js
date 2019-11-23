/*global overwolf*/
import React, { Component } from "react";
import Tooltip from "rc-tooltip";
// Components
import TeamPortrait from "../components/TeamPortrait";
import { CustomTeamPortrait } from "../components/CustomTeamPortrait";
import { BoardPortrait } from "../components/BoardPortrait";
import { withTranslation } from "react-i18next";
class Tracker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [],
      team: "",
      res: "resNormal",
      final: false,
      onlyPin: false
    };
    this.dragWindow = this.dragWindow.bind(this);
    this.hideWindow = this.hideWindow.bind(this);
    this.showFinal = this.showFinal.bind(this);
    this.openTeamBuilder = this.openTeamBuilder.bind(this);
    this.openTraits = this.openTraits.bind(this);
  }

  showFinal() {
    this.setState({
      final: !this.state.final
    });
  }

  openTeamBuilder(e) {
    this.props.openWindow(e);
    overwolf.windows.sendMessage(
      "ingame",
      "trackerPage",
      "teambuilder",
      function(response) {}
    );
  }

  openTraits(e) {
    this.props.openWindow(e);
    overwolf.windows.sendMessage("ingame", "trackerPage", "traits", function(
      response
    ) {});
  }

  componentDidMount() {
    console.log("Tracker mounted!");
    var windowData = overwolf.windows.getMainWindow();
    var _this = this;

    if ("gepStatus" in windowData.localStorage) {
      _this.setState({
        gepStatus: windowData.localStorage.gepStatus
      });
      console.log("gepStatus localStorage found!");
    }

    if ("team" in windowData.localStorage) {
      this.setState({
        team: windowData.localStorage.team
      });
    }
    if ("teambuilder" in windowData.localStorage) {
      this.setState({
        team: JSON.parse(windowData.localStorage.teambuilder)
      });
    }
    if ("onlyPin" in windowData.localStorage) {
      this.setState({
        onlyPin: JSON.parse(windowData.localStorage.onlyPin)
      });
    }

    if ("res" in windowData.localStorage) {
      if (windowData.localStorage.res === "resSmall") {
        this.setState({
          res: windowData.localStorage.res
        });
        // Tracker 75
        overwolf.windows.changeSize("tracker", 480, 600, result => {
          if (result.status === "success") {
            console.log(
              "Change Size for tracker: width: " + 555 + " height: " + 600
            );
          }
        });
      } else {
        // Tracker 100
        overwolf.windows.changeSize("tracker", 555, 600, result => {
          if (result.status === "success") {
            console.log(
              "Change Size for tracker: width: " + 555 + " height: " + 600
            );
          }
        });
      }
    } else {
      // Team 100
      overwolf.windows.changeSize("tracker", 555, 600, result => {
        if (result.status === "success") {
          console.log(
            "Change Size for tracker: width: " + 555 + " height: " + 600
          );
        }
      });
    }

    overwolf.windows.onMessageReceived.addListener(function(info) {
      if (info.id === "board") {
        console.log(
          "board message received: " + info.content.info.board.board_pieces
        );
        var currentBoard = JSON.parse(info.content.info.board.board_pieces);
        var board = [];
        Object.keys(currentBoard).map(function(key) {
          var cell = currentBoard[key];
          var character = {
            name: cell.name.replace("TFT_", "").replace("TFT2_", ""),
            level: cell.level,
            items: [],
            cost: 0
          };
          Object.keys(_this.props.charactersJSON).map(function(key) {
            var champion = _this.props.charactersJSON[key];
            if (champion.active) {
              if (champion.set.includes(parseInt(_this.props.set))) {
                if (
                  champion.name.replace(/ /g, "") ===
                  cell.name.replace("TFT_", "").replace("TFT2_", "")
                ) {
                  character.cost = champion.cost;
                }
              }
            }
            return null;
          });
          if (cell.item_1 !== "") {
            character.items.push(
              cell.item_1
                .replace("ASSETS/Maps/Particles/TFT/", "")
                .replace("ASSETS/Maps/Particles/TFT2/", "")
                .replace("TFT_Item_Backhand", "TFT_Item_TrapClaw")
                .replace("TFT_Item_", "")
                .replace("TFT2_Item_", "")
                .replace("Icon_", "")
                .replace(".dds", "")
            );
          }
          if (cell.item_2 !== "") {
            character.items.push(
              cell.item_2
                .replace("ASSETS/Maps/Particles/TFT/", "")
                .replace("ASSETS/Maps/Particles/TFT2/", "")
                .replace("TFT_Item_Backhand", "TFT_Item_TrapClaw")
                .replace("TFT_Item_", "")
                .replace("TFT2_Item_", "")
                .replace("Icon_", "")
                .replace(".dds", "")
            );
          }
          if (cell.item_3 !== "") {
            character.items.push(
              cell.item_3
                .replace("ASSETS/Maps/Particles/TFT/", "")
                .replace("ASSETS/Maps/Particles/TFT2/", "")
                .replace("TFT_Item_Backhand", "TFT_Item_TrapClaw")
                .replace("TFT_Item_", "")
                .replace("TFT2_Item_", "")
                .replace("Icon_", "")
                .replace(".dds", "")
            );
          }
          board.push(character);
          board.sort((a, b) => (a.name < b.name ? 1 : -1));
          board.sort((a, b) => (a.cost > b.cost ? 1 : -1));
          return null;
        });
        console.log(board);
        board.sort();
        _this.setState({
          board: board
        });
      }

      if (info.id === "set") {
        console.log("set message received: " + info.content);
        _this.props.updateSet(info.content);
      }
      if (info.id === "team") {
        console.log("team message received: " + info);
        _this.setState({
          team: info.content
        });
      }
      if (info.id === "onlyPin") {
        console.log("onlyPin message received: " + info);
        _this.setState({
          onlyPin: JSON.parse(info.content)
        });
      }
      if (info.id === "customteam") {
        console.log("customteam message received: " + info);
        _this.setState({
          team: JSON.parse(info.content)
        });
      }
      if (info.id === "res") {
        console.log("Res Message Received: " + JSON.stringify(info.content));
        _this.setState({
          res: info.content
        });
        switch (info.content) {
          case "resNormal":
            // Tracker 100
            overwolf.windows.changeSize("tracker", 555, 600, result => {
              if (result.status === "success") {
                console.log(
                  "Change Size for tracker: width: " + 555 + " height: " + 600
                );
              }
            });
            break;
          case "resSmall":
            // Tracker 75
            overwolf.windows.changeSize("tracker", 480, 600, result => {
              if (result.status === "success") {
                console.log(
                  "Change Size for tracker: width: " + 555 + " height: " + 600
                );
              }
            });
            break;
          default:
            // Tracker 100
            overwolf.windows.changeSize("tracker", 555, 600, result => {
              if (result.status === "success") {
                console.log(
                  "Change Size for tracker: width: " + 555 + " height: " + 600
                );
              }
            });
            break;
        }
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
  hideWindow() {
    overwolf.windows.obtainDeclaredWindow("tracker", function(result) {
      if (result.status === "success") {
        overwolf.windows.hide(result.window.id);
      }
    });
  }

  render() {
    const { t } = this.props;
    return (
      <div className={"tracker " + this.state.res}>
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
        <div
          className={"tracker-board" + (this.state.onlyPin ? " disabled" : "")}
          onMouseDown={this.dragWindow}
        >
          {this.state.gepStatus !== "3" ? (
            <Tooltip
              placement="top"
              mouseEnterDelay={0.3}
              mouseLeaveDelay={0.3}
              overlay={
                <div className="recap-tooltip">
                  {t(
                    "This is your board in real-time. Expand the window to pin a pre-made team or build your own. Configure this window from the Settings tab of the Database."
                  )}
                </div>
              }
              align={{ offset: [0, -22] }}
            >
              <div className="icon info tracker-info">
                <img
                  src={require("../images/ui/icon-info.svg")}
                  alt="info"
                ></img>
              </div>
            </Tooltip>
          ) : (
            <Tooltip
              placement="top"
              mouseEnterDelay={0.3}
              mouseLeaveDelay={0.3}
              overlay={
                <div className="recap-tooltip">
                  {t(
                    "Game Events are temporarily down. Your board will not update automatically."
                  )}
                </div>
              }
              align={{ offset: [0, -22] }}
            >
              <div className="icon info tracker-info">
                <img
                  src={require("../images/ui/icon-warning.svg")}
                  alt="warning"
                ></img>
              </div>
            </Tooltip>
          )}
          <div className="tracker-team">
            <BoardPortrait
              characters={this.state.board}
              itemsJSON={this.props.itemsJSON}
              charactersJSON={this.props.charactersJSON}
              patchJSON={this.props.patchJSON}
              set={this.props.set}
              lang={this.props.i18n.language}
            ></BoardPortrait>
            <div className="tracker-team-placeholder">
              <div className="blank"></div>
              <div className="blank"></div>
              <div className="blank"></div>
              <div className="blank"></div>
              <div className="blank"></div>
              <div className="blank"></div>
              <div className="blank"></div>
              <div className="blank"></div>
              <div className="blank"></div>
            </div>
          </div>
          <div
            className={
              "tracker-more" +
              (!this.state.final && !this.state.onlyPin ? "" : " open")
            }
            onClick={this.showFinal}
          >
            <i className="arrow down"></i>
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
        </div>
        <div
          className={
            "tracker-final" +
            (!this.state.final && !this.state.onlyPin ? "" : " open")
          }
          onMouseDown={this.dragWindow}
        >
          {this.state.onlyPin ? (
            <Tooltip
              placement="top"
              mouseEnterDelay={0.3}
              mouseLeaveDelay={0.3}
              overlay={
                <div className="recap-tooltip">
                  {t(
                    "Pin a pre-made team or build your own. Configure this window from the Settings tab of the Database."
                  )}
                </div>
              }
              align={{ offset: [0, -22] }}
            >
              <div className="icon info tracker-info">
                <img
                  src={require("../images/ui/icon-info.svg")}
                  alt="info"
                ></img>
              </div>
            </Tooltip>
          ) : (
            <div className="tracker-space"></div>
          )}
          <div className="tracker-team">
            {this.state.team !== "" || this.state.team !== [] ? (
              typeof this.state.team === "string" ? (
                Object.keys(this.props.metaJSON).map(function(key) {
                  var team = this.props.metaJSON[key];
                  if (team.name === this.state.team) {
                    if (team.set.includes(parseInt(this.props.set))) {
                      return team.name === this.state.team ? (
                        <React.Fragment>
                          <TeamPortrait
                            data={team}
                            key={key}
                            pin={true}
                            originsJSON={this.props.originsJSON}
                            typesJSON={this.props.typesJSON}
                            itemsJSON={this.props.itemsJSON}
                            charactersJSON={this.props.charactersJSON}
                            patchJSON={this.props.patchJSON}
                            set={this.props.set}
                            lang={this.props.i18n.language}
                          ></TeamPortrait>
                        </React.Fragment>
                      ) : null;
                    }
                  }
                  return null;
                }, this)
              ) : (
                <CustomTeamPortrait
                  data={this.state.team}
                  originsJSON={this.props.originsJSON}
                  typesJSON={this.props.typesJSON}
                  charactersJSON={this.props.charactersJSON}
                  patchJSON={this.props.patchJSON}
                  set={this.props.set}
                  lang={this.props.i18n.language}
                ></CustomTeamPortrait>
              )
            ) : null}
            <div className="tracker-team-placeholder">
              <div className="blank"></div>
              <div className="blank"></div>
              <div className="blank"></div>
              <div className="blank"></div>
              <div className="blank"></div>
              <div className="blank"></div>
              <div className="blank"></div>
              <div className="blank"></div>
              <div className="blank"></div>
            </div>
          </div>
          <div className="tracker-final-buttons">
            <Tooltip
              placement="bottom"
              overlay={
                <div className="tracker-btn-overlay">{t("Change Team")}</div>
              }
              align={{ offset: [0, 8] }}
              key={origin.name}
            >
              <div
                className="tracker-final-btn"
                page="ingame"
                onClick={this.openTraits}
              >
                <img
                  src={require("../images/ui/icon-change.svg")}
                  alt={t("Change Team")}
                ></img>
              </div>
            </Tooltip>
            <Tooltip
              placement="bottom"
              overlay={
                <div className="tracker-btn-overlay">{t("Build Team")}</div>
              }
              align={{ offset: [0, 8] }}
              key={origin.name}
            >
              <div
                className="tracker-final-btn"
                page="ingame"
                onClick={this.openTeamBuilder}
              >
                <img
                  src={require("../images/ui/icon-build.svg")}
                  alt={t("Change Team")}
                ></img>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Tracker);
