/*global overwolf*/
/*global OwAd*/
import React, { Component } from "react";
import WindowNames from "../common/constants/window-names";
import WindowsService from "../common/services/windows-service";
import axios from "axios";
import Tooltip from "rc-tooltip";
// Components
import ItemBuilder from "../components/ItemBuilder";
import Champions from "../components/Champions";
import Traits from "../components/Traits";
import TeamBuilder from "../components/TeamBuilder";
import TierLists from "../components/TierLists";
import MatchHistory from "../components/MatchHistory";
import MatchRecap from "../components/MatchRecap";
import Patch from "../components/Patch";
import Settings from "../components/Settings";
import { withTranslation } from "react-i18next";

class InGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summonerName: "",
      tier: "",
      division: "",
      databasePage: "traits",
      hotkey: "",
      toggle: "",
      res: "resNormal",
      puuid: "",
      settingsPage: "Settings",
      apiStatus: true,
      matchHistory: null,
      allowGet: true,
      historyNew: true,
      patchNew: false,
      lastMatch: null,
      matchData: null,
      showTeam: true,
      dropdownOpen: false
    };
    this.dragWindow = this.dragWindow.bind(this);
    this.hideWindow = this.hideWindow.bind(this);
    this.setPage = this.setPage.bind(this);
    this.setSettingsPage = this.setSettingsPage.bind(this);
    this.refreshHistory = this.refreshHistory.bind(this);
    this.clearNew = this.clearNew.bind(this);
    this.clearPatchNew = this.clearPatchNew.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  componentWillReceiveProps() {
    if (
      this.props.patchVer.length > 0 &&
      "patchVer" in overwolf.windows.getMainWindow().localStorage
    ) {
      this.setState({
        patchNew:
          this.props.patchVer ===
          overwolf.windows.getMainWindow().localStorage.patchVer
            ? false
            : true
      });
    }
  }

  componentDidMount() {
    console.log("In-game mounted!");
    var windowData = overwolf.windows.getMainWindow();
    var _this = this;

    axios
      .get("https://game-events-status.overwolf.com/gamestatus_prod.json")
      .then(function(response) {
        Object.keys(response.data).map(function(key) {
          var game = response.data[key];
          if (game.game_id === 21570) {
            console.log("GEP status: " + game.state);
            localStorage.setItem("gepStatus", game.state + "");
            _this.setState({
              gepStatus: game.state + ""
            });
          }
          return null;
        }, _this);
      })
      .catch(function(error) {
        console.log(error);
      });

    if ("gepStatus" in windowData.localStorage) {
      _this.setState({
        gepStatus: windowData.localStorage.gepStatus
      });
      console.log("gepStatus localStorage found!");
    }

    if ("res" in windowData.localStorage) {
      if (windowData.localStorage.res === "resSmall") {
        this.setState({
          res: "resSmall"
        });
        // InGame 75
        overwolf.windows.changeSize("ingame", 1000, 580, result => {
          if (result.status === "success") {
            console.log(
              "Change Size for ingame: width: " + 1000 + " height: " + 580
            );
          }
        });
      } else {
        // InGame 100
        overwolf.windows.changeSize("ingame", 1200, 695, result => {
          if (result.status === "success") {
            console.log(
              "Change Size for ingame: width: " + 1200 + " height: " + 695
            );
          }
        });
      }
    } else {
      // InGame 100
      overwolf.windows.changeSize("ingame", 1200, 695, result => {
        if (result.status === "success") {
          console.log(
            "Change Size for ingame: width: " + 1200 + " height: " + 695
          );
        }
      });
    }

    if ("puuid" in windowData.localStorage) {
      this.setState({
        puuid: windowData.localStorage.puuid
      });
      console.log("puuid found: " + windowData.localStorage.puuid);
      axios
        .get(
          "https://tft-service.gamedata.gg/api/match_history/" +
            windowData.localStorage.puuid
        )
        .then(function(response) {
          _this.setState({
            apiStatus: true,
            matchHistory: response.data.results
          });
          // console.log('Data from call: ' + JSON.stringify(response))
        })
        .catch(function(error) {
          console.log(error);
          _this.setState({
            apiStatus: false
          });
        });
    }

    if ("historyNew" in windowData.localStorage) {
      this.setState({
        historyNew: false
      });
    }

    if (!("patchVer" in windowData.localStorage)) {
      this.setState({
        patchNew: true
      });
    }

    if ("matchRecap" in windowData.localStorage) {
      this.setState({
        matchData: JSON.parse(windowData.localStorage.matchRecap)
      });
      console.log("matchRecap localStorage found!");
    }

    if ("lastMatch" in windowData.localStorage) {
      this.setState({
        lastMatch: JSON.parse(windowData.localStorage.lastMatch)
      });
      console.log("lastMatch localStorage found!");
    }

    if ("summonerName" in windowData.localStorage) {
      _this.setState({
        summonerName: windowData.localStorage.summonerName
      });
      console.log("summonerName localStorage found!");
    }
    if ("tier" in windowData.localStorage) {
      _this.setState({
        tier: windowData.localStorage.tier
      });
      console.log("tier localStorage found!");
    }
    if ("division" in windowData.localStorage) {
      _this.setState({
        division: windowData.localStorage.division
      });
      console.log("division localStorage found!");
    }

    overwolf.settings.getHotKey("toggleWindows", result => {
      this.setState({
        hotkey: result.hotkey
      });
    });
    overwolf.settings.getHotKey("toggleDatabase", result => {
      this.setState({
        toggle: result.hotkey
      });
    });
    overwolf.settings.OnHotKeyChanged.addListener(result => {
      if (result.source === "toggleWindows") {
        this.setState({
          hotkey: result.hotkey
        });
      } else if (result.source === "toggleDatabase") {
        this.setState({
          toggle: result.hotkey
        });
      }
    });

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://content.overwolf.com/libs/ads/latest/owads.min.js";
    script.async = true;
    script.onload = function() {
      const owAdInstance = new OwAd(document.getElementById("ad-div"));
      overwolf.windows.onStateChanged.addListener(function(info) {
        if (
          info.window_state === "minimized" &&
          info.window_name === "ingame"
        ) {
          console.log("in-game ad is getting removed");
          owAdInstance.removeAd();
        } else if (
          info.window_previous_state === "minimized" &&
          info.window_state === "normal" &&
          info.window_name === "ingame"
        ) {
          console.log("in-game ad is getting refreshed");
          owAdInstance.refreshAd();
        }
      });
    };
    document.body.appendChild(script);

    // Listener for Resolution Changes
    overwolf.windows.onMessageReceived.addListener(function(info) {
      if (info.id === "res") {
        console.log("Res Message Received: " + JSON.stringify(info.content));
        _this.setState({
          res: info.content
        });
        switch (info.content) {
          case "resNormal":
            // InGame 100
            overwolf.windows.changeSize("ingame", 1200, 695, result => {
              if (result.status === "success") {
                console.log(
                  "Change Size for ingame: width: " + 1200 + " height: " + 695
                );
              }
            });
            break;
          case "resSmall":
            // InGame 75
            overwolf.windows.changeSize("ingame", 1000, 580, result => {
              if (result.status === "success") {
                console.log(
                  "Change Size for ingame: width: " + 1000 + " height: " + 580
                );
              }
            });
            break;
          default:
            return null;
        }
      }
      if (info.id === "puuid") {
        console.log("Puuid Message Received: " + JSON.stringify(info.content));
        _this.setState({
          puuid: info.content
        });
      }

      if (info.id === "liveMatch") {
        if ("matchRecap" in windowData.localStorage) {
          _this.setState({
            matchData: JSON.parse(windowData.localStorage.matchRecap),
            showTeam: false
          });
          console.log("matchRecap localStorage found!");
        }
        if ("summonerName" in windowData.localStorage) {
          _this.setState({
            summonerName: windowData.localStorage.summonerName
          });
          console.log("summonerName localStorage found!");
        }
        if ("tier" in windowData.localStorage) {
          _this.setState({
            tier: windowData.localStorage.tier
          });
          console.log("tier localStorage found!");
        }
        if ("division" in windowData.localStorage) {
          _this.setState({
            division: windowData.localStorage.division
          });
          console.log("division localStorage found!");
        }
      }
      if (info.id === "trackerPage") {
        _this.setState({
          databasePage: info.content
        });
      }
      if (info.id === "page") {
        console.log("Page Message Received: " + JSON.stringify(info.content));
        if ("matchRecap" in windowData.localStorage) {
          _this.setState({
            matchData: JSON.parse(windowData.localStorage.matchRecap)
          });
          console.log("matchRecap localStorage found!");
        }
        if ("lastMatch" in windowData.localStorage) {
          _this.setState({
            lastMatch: JSON.parse(windowData.localStorage.lastMatch),
            showTeam: true
          });
          console.log("lastMatch localStorage found!");
        }
        _this.setState({
          databasePage: "recap"
        });
        if (_this.state.allowGet && _this.state.puuid !== "") {
          axios
            .get(
              "https://tft-service.gamedata.gg/api/match_history/" +
                _this.state.puuid
            )
            .then(function(response) {
              _this.setState({
                matchHistory: response.data.results,
                allowGet: false
              });
              // console.log('Data from call: ' + JSON.stringify(response), 'Set allowGet to: ' + _this.state.allowGet)
            })
            .catch(function(error) {
              console.log(error);
            });
        }
        setTimeout(function() {
          _this.setState({
            allowGet: true
          });
          console.log("Set allowGet to: " + _this.state.allowGet);
        }, 180000);
      }
      if (info.id === "notice") {
        _this.setState({
          databasePage: "patch"
        });
      }
    });
  }

  refreshHistory() {
    var _this = this;
    if (this.state.allowGet && this.state.puuid !== "") {
      axios
        .get(
          "https://tft-service.gamedata.gg/api/match_history/" +
            this.state.puuid
        )
        .then(function(response) {
          _this.setState({
            matchHistory: response.data.results,
            allowGet: false
          });
          // console.log('Data from call: ' + JSON.stringify(response), 'Set allowGet to: ' + _this.state.allowGet)
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    setTimeout(function() {
      _this.setState({
        allowGet: true
      });
      console.log("Set allowGet to: " + _this.state.allowGet);
    }, 180000);
  }

  toggleDropdown() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  hideWindow() {
    overwolf.games.getRunningGameInfo(function(result) {
      console.log(JSON.stringify(result));
      if (result !== null) {
        if (
          result.title === "League of Legends" ||
          result.id === 54267 ||
          result.classId === 5426
        ) {
          console.log("TFT is running, hiding ingame");
          WindowsService.hide(WindowNames.IN_GAME);
        } else {
          WindowsService.close(WindowNames.BACKGROUND);
        }
      } else {
        WindowsService.close(WindowNames.BACKGROUND);
      }
    });
  }

  // Overwolf
  dragWindow() {
    overwolf.windows.getCurrentWindow(function(result) {
      if (result.status === "success") {
        overwolf.windows.dragMove(result.window.id);
      }
    });
  }

  setPage(e) {
    this.setState({
      databasePage: e.currentTarget.attributes.page.value
    });
  }

  setSettingsPage(e) {
    this.setState({
      databasePage: e.currentTarget.attributes.page.value,
      settingsPage: e.currentTarget.attributes.settings.value
    });
  }

  clearNew() {
    this.setState({
      historyNew: false
    });
    localStorage.setItem("historyNew", "clear");
  }

  clearPatchNew() {
    this.setState({
      patchNew: false
    });
    localStorage.setItem("patchVer", this.props.patchVer);
    console.log("Current Patch Version: " + localStorage.getItem("patchVer"));
  }

  render() {
    const { t } = this.props;
    var databasePage = this.state.databasePage;
    let page;
    switch (databasePage) {
      case "itembuilder":
        page = (
          <ItemBuilder
            itemsJSON={this.props.itemsJSON}
            patchJSON={this.props.patchJSON}
            lang={this.props.i18n.language}
            set={this.props.set}
          />
        );
        break;
      case "champions":
        page = (
          <Champions
            itemsJSON={this.props.itemsJSON}
            charactersJSON={this.props.charactersJSON}
            patchJSON={this.props.patchJSON}
            lang={this.props.i18n.language}
            set={this.props.set}
          />
        );
        break;
      case "traits":
        page = (
          <Traits
            setTeam={this.props.setTeam}
            metaJSON={this.props.metaJSON}
            originsJSON={this.props.originsJSON}
            typesJSON={this.props.typesJSON}
            itemsJSON={this.props.itemsJSON}
            charactersJSON={this.props.charactersJSON}
            patchJSON={this.props.patchJSON}
            lang={this.props.i18n.language}
            set={this.props.set}
          />
        );
        break;
      case "teambuilder":
        page = (
          <TeamBuilder
            originsJSON={this.props.originsJSON}
            typesJSON={this.props.typesJSON}
            charactersJSON={this.props.charactersJSON}
            patchJSON={this.props.patchJSON}
            lang={this.props.i18n.language}
            set={this.props.set}
          />
        );
        break;
      case "tierlist":
        page = (
          <TierLists
            originsJSON={this.props.originsJSON}
            typesJSON={this.props.typesJSON}
            itemsJSON={this.props.itemsJSON}
            charactersJSON={this.props.charactersJSON}
            patchJSON={this.props.patchJSON}
            lang={this.props.i18n.language}
            set={this.props.set}
          />
        );
        break;
      case "history":
        if (this.state.matchHistory) {
          page = (
            <MatchHistory
              originsJSON={this.props.originsJSON}
              typesJSON={this.props.typesJSON}
              charactersJSON={this.props.charactersJSON}
              itemsJSON={this.props.itemsJSON}
              refreshHistory={this.refreshHistory}
              matchHistory={this.state.matchHistory}
              allowGet={this.state.allowGet}
              clearNew={this.clearNew}
              patchJSON={this.props.patchJSON}
              lastMatch={this.state.lastMatch}
              apiStatus={this.state.apiStatus}
              summonerName={this.state.summonerName}
              tier={this.state.tier}
              division={this.state.division}
              lang={this.props.i18n.language}
              set={this.props.set}
            />
          );
        } else {
          page = (
            <MatchHistory
              originsJSON={this.props.originsJSON}
              typesJSON={this.props.typesJSON}
              charactersJSON={this.props.charactersJSON}
              itemsJSON={this.props.itemsJSON}
              refreshHistory={this.refreshHistory}
              matchHistory={[]}
              allowGet={this.state.allowGet}
              clearNew={this.clearNew}
              patchJSON={this.props.patchJSON}
              lastMatch={this.state.lastMatch}
              apiStatus={this.state.apiStatus}
              summonerName={this.state.summonerName}
              tier={this.state.tier}
              division={this.state.division}
              lang={this.props.i18n.language}
              set={this.props.set}
            />
          );
        }
        break;
      case "recap":
        page = (
          <MatchRecap
            itemsJSON={this.props.itemsJSON}
            charactersJSON={this.props.charactersJSON}
            patchJSON={this.props.patchJSON}
            matchData={this.state.matchData}
            lastMatch={this.state.lastMatch}
            apiStatus={this.state.apiStatus}
            summonerName={this.state.summonerName}
            tier={this.state.tier}
            division={this.state.division}
            showTeam={this.state.showTeam}
            lang={this.props.i18n.language}
            gepStatus={this.state.gepStatus}
            set={this.props.set}
          />
        );
        break;
      case "patch":
        page = (
          <Patch
            patchFull={this.props.patchFull}
            clearPatchNew={this.clearPatchNew}
            lang={this.props.i18n.language}
          />
        );
        break;
      case "settings":
        page = (
          <Settings
            settingsPage={this.state.settingsPage}
            setSettingsPage={this.setSettingsPage}
            lang={this.props.i18n.language}
          />
        );
        break;
      default:
        break;
    }
    return (
      <div className={"db " + this.state.res}>
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
          <div className="header-group">
            <img
              className="brand"
              src={require("../images/brand.svg")}
              alt="tftactics.gg"
            ></img>
            <div
              className={"set-btn" + (this.state.dropdownOpen ? " open" : "")}
              onClick={this.toggleDropdown}
            >
              Set {this.props.set}
              <i
                className={
                  "arrow" + (this.state.dropdownOpen ? " down" : " up")
                }
              ></i>
              <div className="set-list">
                <div
                  set={"1"}
                  onClick={this.props.setSet}
                  className={
                    "set-list-item" + (this.state.set === "1" ? " active" : "")
                  }
                >
                  Set 1
                </div>
                <div
                  set={"2"}
                  onClick={this.props.setSet}
                  className={
                    "set-list-item" + (this.state.set === "2" ? " active" : "")
                  }
                >
                  Set 2
                </div>
              </div>
            </div>
          </div>
          <div className="app-status">
            <Tooltip
              placement="bottom"
              mouseLeaveDelay={0}
              overlay={
                <div className="service-status-tooltip">
                  <div className="recap-tooltip">
                    {this.state.gepStatus === "1" && this.state.apiStatus
                      ? t(
                          "Everything is up and running. Some app features do not work in Garena servers."
                        )
                      : this.state.gepStatus === "2"
                      ? t("Some features may be temporarily unavailable.")
                      : t("Several app features are temporarily unavailable.")}
                  </div>
                </div>
              }
              align={{ offset: [0, 0] }}
            >
              <div className="status-group">
                {t("Service Status:")}
                <span
                  className={
                    "status-item" +
                    (this.state.apiStatus && this.state.gepStatus === "1"
                      ? " up"
                      : " down")
                  }
                ></span>
              </div>
            </Tooltip>
          </div>
          <div className="app-instructions">
            <div className="instruction-group">
              {t("Hide All:")}
              <a href="overwolf://settings/hotkeys">
                <b>{this.state.hotkey}</b>
              </a>
            </div>
            <div className="instruction-group">
              {t("Toggle Database:")}
              <a href="overwolf://settings/hotkeys">
                <b>{this.state.toggle}</b>
              </a>
            </div>
          </div>
          <div className="window-controls-group">
            <button
              className="icon window-control"
              onClick={this.setSettingsPage}
              page="settings"
              settings={"settings"}
            >
              <img
                className="icon window-control"
                src={require("../images/nav/nav-settings.svg")}
                alt="Settings"
              ></img>
            </button>
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

        <div className="db-content">
          <div className="db-nav">
            <div
              className={
                "db-nav-item" +
                (this.props.i18n.language !== "ch" ? " tc" : " tc_ch") +
                (this.state.databasePage === "traits" ? " active" : "")
              }
              page="traits"
              onClick={this.setPage}
            >
              <img
                className="db-nav-icon"
                src={require("../images/nav/nav-traits.svg")}
                alt={t("Traits")}
              ></img>
            </div>
            <div
              className={
                "db-nav-item" +
                (this.props.i18n.language !== "ch" ? " ch" : " ch_ch") +
                (this.state.databasePage === "champions" ? " active" : "")
              }
              page="champions"
              onClick={this.setPage}
            >
              <img
                className="db-nav-icon"
                src={require("../images/nav/nav-champions.png")}
                alt={t("Champions")}
              ></img>
            </div>
            <div
              className={
                "db-nav-item" +
                (this.props.i18n.language !== "ch" ? " tl" : " tl_ch") +
                (this.state.databasePage === "tierlist" ? " active" : "")
              }
              page="tierlist"
              onClick={this.setPage}
            >
              <img
                className="db-nav-icon"
                src={require("../images/nav/nav-tier.svg")}
                alt={t("Tier Lists")}
              ></img>
            </div>
            <div
              className={
                "db-nav-item" +
                (this.props.i18n.language !== "ch" ? " ib" : " ib_ch") +
                (this.state.databasePage === "itembuilder" ? " active" : "")
              }
              page="itembuilder"
              onClick={this.setPage}
            >
              <img
                className="db-nav-icon"
                src={require("../images/nav/nav-items.svg")}
                alt={t("Item Builder")}
              ></img>
            </div>
            <div
              className={
                "db-nav-item" +
                (this.props.i18n.language !== "ch" ? " tb" : " tb_ch") +
                (this.state.databasePage === "teambuilder" ? " active" : "")
              }
              page="teambuilder"
              onClick={this.setPage}
            >
              <img
                className="db-nav-icon"
                src={require("../images/nav/nav-teambuilder.svg")}
                alt={t("Team Builder")}
              ></img>
            </div>
            <div
              className={
                "db-nav-item" +
                (this.props.i18n.language !== "ch" ? " mh" : " mh_ch") +
                (this.state.databasePage === "history" ? " active" : "") +
                (this.state.historyNew ? " new" : "")
              }
              page="history"
              onClick={this.setPage}
            >
              <img
                className="db-nav-icon"
                src={require("../images/nav/nav-history.svg")}
                alt="Match History"
              ></img>
            </div>
            <div
              className={
                "db-nav-item" +
                (this.props.i18n.language !== "ch" ? " r" : " r_ch") +
                (this.state.databasePage === "recap" ? " active" : "")
              }
              page="recap"
              onClick={this.setPage}
            >
              <img
                className="db-nav-icon"
                src={require("../images/nav/nav-recap.svg")}
                alt="Match Recap"
              ></img>
            </div>
            <div
              className={
                "db-nav-item" +
                (this.props.i18n.language !== "ch" ? " p" : " p_ch") +
                (this.state.databasePage === "patch" ? " active" : "") +
                (this.state.patchNew ? " new" : "")
              }
              page="patch"
              onClick={this.setPage}
            >
              <img
                className="db-nav-icon"
                src={require("../images/nav/nav-patch.svg")}
                alt="Patch Notes"
              ></img>
            </div>
            <div
              className={
                "db-nav-item" +
                (this.props.i18n.language !== "ch" ? " s" : " s_ch") +
                (this.state.databasePage === "settings" &&
                this.state.settingsPage === "settings"
                  ? " active"
                  : "")
              }
              page="settings"
              onClick={this.setSettingsPage}
              settings={"settings"}
            >
              <img
                className="db-nav-icon"
                src={require("../images/nav/nav-settings.svg")}
                alt="Settings"
              ></img>
            </div>
            <div
              className={
                "db-nav-item" +
                (this.props.i18n.language !== "ch"
                  ? " contact"
                  : " contact_ch") +
                (this.state.databasePage === "settings" &&
                this.state.settingsPage === "contact"
                  ? " active"
                  : "")
              }
              page="settings"
              onClick={this.setSettingsPage}
              settings={"contact"}
            >
              <img
                className="db-nav-icon"
                src={require("../images/nav/nav-contact.svg")}
                alt="Settings"
              ></img>
            </div>
          </div>
          {page}
          <div id="ad-div" className="ow-ad"></div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(InGame);
