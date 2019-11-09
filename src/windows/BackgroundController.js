/*global overwolf*/
import axios from "axios";
import WindowNames from "../common/constants/window-names";
import RunningGameService from "../common/services/running-game-service";
import WindowsService from "../common/services/windows-service";
import HotkeysService from "../common/services/hotkeys-service";

class BackgroundController {
  static async run() {
    BackgroundController._registerAppLaunchTriggerHandler();
    // BackgroundController._registerHotkeys();

    let startupWindow = await WindowsService.getStartupWindowName();
    WindowsService.restore(startupWindow);

    RunningGameService.addGameRunningChangedListener(isGameRunning => {
      if (!isGameRunning) {
        console.log("closing app after game closed");
        localStorage.setItem("matchRecap", JSON.stringify(matchData));
        console.log("matchData:" + localStorage.getItem("matchRecap"));
        WindowsService.hide(WindowNames.WINDOWED);
        WindowsService.hide(WindowNames.IN_GAME);
        WindowsService.hide(WindowNames.TRACKER);
        WindowsService.hide(WindowNames.ROLLING);
        WindowsService.hide(WindowNames.LOADING);
        if (
          matchData !== {} &&
          localStorage.getItem("mode") === "tft" &&
          localStorage.getItem("gepStatus") !== "3"
        ) {
          overwolf.windows.sendMessage("ingame", "page", "history", function(
            response
          ) {
            if (response.status === "error") {
              console.log("Page message failed!");
            } else if (response.status === "success") {
              console.log("Page message sent!");
            }
          });
          WindowsService.restore(WindowNames.IN_GAME);
          overwolf.windows.setPosition(
            {
              relativeTo: {
                processName: "LeagueClientUx",
                windowTitle: "League of Legends"
              },
              insertAbove: false
            },
            console.log
          );
          localStorage.setItem("mode", "other");
          console.log("Setting localStorage mode to other");
        }
      }
    });

    // Message Listener for Initial Team
    overwolf.windows.onMessageReceived.addListener(function(info) {
      console.log("Message received :" + info.id);
      localStorage.setItem(info.id, info.content);
      var allWindows = [
        "windowed",
        "ingame",
        "tracker",
        // 'team',
        // 'customteam',
        "rolling"
      ];
      if (info.id === "res") {
        Object.keys(allWindows).map(function(key) {
          var window = allWindows[key];
          overwolf.windows.sendMessage(window, info.id, info.content, function(
            response
          ) {
            if (response.status === "error") {
              console.log("resolution message not sent to: " + window);
            } else if (response.status === "success") {
              console.log("resolution message sent to: " + window);
            }
          });
          return null;
        }, this);
      }
      if (info.id === "lang") {
        Object.keys(allWindows).map(function(key) {
          var window = allWindows[key];
          overwolf.windows.sendMessage(window, info.id, info.content, function(
            response
          ) {
            if (response.status === "error") {
              console.log("language message not sent to: " + window);
            } else if (response.status === "success") {
              console.log("language message sent to: " + window);
            }
          });
          return null;
        }, this);
      }
    });

    function isEmpty(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
      }
      return true;
    }

    var summonerName;
    var tier;
    var division;
    var matchData = {};
    var boardData = {};

    // REGISTER LAUNCHER EVENTS
    function registerEvents() {
      console.log("registerEvents fired");
      // general events errors
      overwolf.games.events.onError.addListener(function(info) {
        console.log("Launcher onError: " + JSON.stringify(info));
      });

      overwolf.games.launchers.events.onInfoUpdates.addListener(function(info) {
        console.log("Launcher onInfoUpdates: " + JSON.stringify(info));
        if (info.feature === "end_game") {
          if (info.info.end_game_tft.tft_end_game_stats !== "null") {
            // Get and Send Data to DB
            var windowData = overwolf.windows.getMainWindow();
            overwolf.games.launchers.events.getInfo(10902, function(info3) {
              console.log(
                "Match has ended, launcher info: " + JSON.stringify(info3)
              );
              var summonerInfo;
              var gameVersion;
              var end_game_tft;
              if ("summoner_info" in info3.res) {
                summonerInfo = info3.res.summoner_info;
              }
              if ("game_info" in info3.res) {
                if ("game_version" in info3.res.game_info) {
                  gameVersion = info3.res.game_info.game_version;
                  gameVersion = gameVersion.substring(
                    0,
                    gameVersion.lastIndexOf(".")
                  );
                  console.log("Game version: " + gameVersion);
                }
              }
              if ("end_game_tft" in info3.res) {
                end_game_tft = JSON.parse(
                  info3.res.end_game_tft.tft_end_game_stats
                );
                localStorage.setItem("puuid", end_game_tft.localPlayer.puuid);
                console.log("Set puuid: " + localStorage.getItem("puuid"));
                overwolf.windows.sendMessage(
                  "ingame",
                  "puuid",
                  end_game_tft.localPlayer.puuid,
                  function(response) {
                    if (response.status === "error") {
                      console.log("InGame Puuid Message Failed!");
                    } else if (response.status === "success") {
                      console.log(
                        "InGame Puuid Message Sent:" +
                          end_game_tft.localPlayer.puuid
                      );
                    }
                  }
                );
              }
              var matchRecap = JSON.parse(windowData.localStorage.matchRecap);
              // For Database
              var date = new Date();
              var rounds = matchRecap[windowData.localStorage.summonerName];
              var roundsTotal = 0;
              var roundsWon = 0;
              var roundsLost = 0;
              Object.keys(rounds).map(function(key) {
                var round = rounds[key];
                roundsTotal += 1;
                if (round.outcome === "victory") {
                  roundsWon += 1;
                }
                if (round.outcome === "defeat") {
                  roundsLost += 1;
                }
                return null;
              }, this);
              var fullMatch = {
                date: date,
                gameId: end_game_tft.gameId,
                gameLength: end_game_tft.gameLength,
                isRanked: end_game_tft.isRanked,
                gameRegion: summonerInfo.region,
                localPlayer: end_game_tft.localPlayer,
                players: end_game_tft.players,
                items: boardData,
                patch: gameVersion
              };
              fullMatch.localPlayer["roundsTotal"] = roundsTotal;
              fullMatch.localPlayer["roundsWon"] = roundsWon;
              fullMatch.localPlayer["roundsLost"] = roundsLost;

              if ("tier" in windowData.localStorage) {
                fullMatch["tier"] = windowData.localStorage.tier;
                console.log("tier localStorage found!");
              }
              if ("division" in windowData.localStorage) {
                fullMatch["division"] = windowData.localStorage.division;
                console.log("division localStorage found!");
              }

              localStorage.setItem("lastMatch", JSON.stringify(fullMatch));
              axios
                .post(
                  "https://tft-service.gamedata.gg/api/upload_data/",
                  fullMatch
                )
                .then(function(response) {
                  console.log(response);
                })
                .catch(function(error) {
                  console.log(error);
                });
              console.log("Data sent: " + JSON.stringify(fullMatch));
            });
          }
        }
        if (info.feature === "game_info") {
          console.log("new game_info from launcher!");
        }
      });

      overwolf.games.launchers.events.onNewEvents.addListener(function(info) {
        console.log("Launcher onNewEvents: " + JSON.stringify(info));
      });
    }
    // REGISTER GAME EVENTS
    function registerGameEvents() {
      console.log("registerGameEvents fired");
      // General Error Catch
      overwolf.games.events.onError.addListener(function(info) {
        console.log("Game onError: " + JSON.stringify(info));
      });
      // Info Updates 2 (Current XP => Send Message to Rolling Window)
      overwolf.games.events.onInfoUpdates2.addListener(function(info) {
        console.log("Game onInfoUpdates2:" + JSON.stringify(info));
        if (info.feature === "me") {
          if ("xp" in info.info.me) {
            overwolf.windows.sendMessage("rolling", "chance", info, function(
              response
            ) {
              if (response.status === "error") {
                console.log("onInfoUpdates2 chance message failed!");
              } else if (response.status === "success") {
                console.log("onInfoUpdates2 chance message sent!");
              }
            });
          }
        }
        if (info.feature === "board") {
          if ("board_pieces" in info.info.board) {
            var boardInfo = JSON.parse(info.info.board.board_pieces);
            if (JSON.stringify(boardInfo) === "{}") {
              console.log(
                "BLANK board message not sent: " + JSON.stringify(boardInfo)
              );
            } else {
              boardData = boardInfo;
              overwolf.windows.sendMessage("tracker", "board", info, function(
                response
              ) {
                if (response.status === "error") {
                  console.log("onInfoUpdates2 board message failed!");
                } else if (response.status === "success") {
                  console.log("onInfoUpdates2 board message sent!");
                }
              });
            }
          }
        }
      });
      // New Events (Match Start => Check TFT ID, Open Windowed and Rolling Windows)
      overwolf.games.events.onNewEvents.addListener(function(info) {
        console.log("Game onNewEvents:" + JSON.stringify(info));
        if (
          info.events[0].name === "round_end" ||
          info.events[0].name === "match_end"
        ) {
          overwolf.games.events.getInfo(function(info2) {
            summonerName = info2.res.me.summoner_name;
            tier = info2.res.summoner_info.tier;
            division = info2.res.summoner_info.division;
            var round_type = JSON.parse(info2.res.match_info.round_type);
            var round_outcome = JSON.parse(info2.res.match_info.round_outcome);
            var roster = JSON.parse(info2.res.roster.player_status);
            var gold = info2.res.me.gold ? info2.res.me.gold : "0";
            var damage = info2.res.match_info.local_player_damage
              ? JSON.parse(info2.res.match_info.local_player_damage)
              : {};

            if (isEmpty(matchData)) {
              Object.keys(roster).map(function(key, index) {
                matchData[key] = {};
                return null;
              });
              console.log("base matchData: " + matchData);
            }

            Object.keys(roster).map(function(key, index) {
              var player = roster[key];
              matchData[key][round_type.stage] = {
                rank: player.rank + "",
                health: player.health + "",
                level: player.xp + "",
                outcome:
                  key in round_outcome ? round_outcome[key].outcome : null
              };
              return null;
            });

            matchData[summonerName][round_type.stage]["gold"] = gold;
            matchData[summonerName][round_type.stage]["damage"] = damage;
            localStorage.setItem("summonerName", summonerName);
            localStorage.setItem("tier", tier);
            localStorage.setItem("division", division);
            localStorage.setItem("matchRecap", JSON.stringify(matchData));
            overwolf.windows.sendMessage(
              "ingame",
              "liveMatch",
              "updated",
              function(response) {
                if (response.status === "error") {
                  console.log("ingame liveMatch message failed!");
                } else if (response.status === "success") {
                  console.log("ingame liveMatch message sent!");
                }
              }
            );

            if (info.status === "error") {
              console.log("Could not getInfo within onNewEvents");
            }
          });
        }
      });
    }

    var windowHeight = 720;
    var windowWidth = 1280;

    function getGameQueueId() {
      overwolf.games.events.getInfo(function(info) {
        if (info.status === "success") {
          if (
            info.res.game_info.queueId === "1090" ||
            info.res.game_info.queueId === "1100"
          ) {
            var notice = false;
            var _this = this;
            matchData = {};
            console.log("MatchData reset: " + JSON.stringify(matchData));
            WindowsService.hide(WindowNames.IN_GAME);
            WindowsService.restore(WindowNames.LOADING);
            WindowsService.preLaunch(WindowNames.IN_GAME);
            localStorage.setItem("mode", "tft");
            if (!localStorage.getItem("itemsWindow")) {
              localStorage.setItem("itemsWindow", "enabled");
            }
            if (!localStorage.getItem("rollingWindow")) {
              localStorage.setItem("rollingWindow", "enabled");
            }
            if (!localStorage.getItem("trackerWindow")) {
              localStorage.setItem("trackerWindow", "enabled");
            }
            axios
              .get("https://rerollcdn.com/data/patch.json")
              .then(function(response) {
                console.log(
                  "Axios Patch Version: " + response.data.Ver,
                  "Localstorage Patch Version: " +
                    localStorage.getItem("patchVer")
                );
                if (!localStorage.getItem("patchVer")) {
                  notice = true;
                  localStorage.setItem("patchVer", response.data.Ver);
                } else if (
                  !(response.data.Ver === localStorage.getItem("patchVer"))
                ) {
                  notice = true;
                  localStorage.setItem("patchVer", response.data.Ver);
                }
              })
              .catch(function(error) {
                console.log(error);
              });
            overwolf.extensions.current.getManifest(function(app) {
              console.log("App Version: " + app.meta.version);
            });
            axios
              .get(
                "https://game-events-status.overwolf.com/gamestatus_prod.json"
              )
              .then(function(response) {
                Object.keys(response.data).map(function(key) {
                  var game = response.data[key];
                  if (game.game_id === 21570) {
                    console.log("GEP status: " + game.state);
                    localStorage.setItem("gepStatus", game.state + "");
                  }
                  return null;
                }, _this);
              })
              .catch(function(error) {
                console.log(error);
              });
            setTimeout(function() {
              // Set initial position (user can override after)
              if (!localStorage.getItem("firstLaunch")) {
                // Windowed
                var windowedSpecs = {
                  left: 0,
                  top: windowHeight - 650,
                  width: 500,
                  height: 650
                };
                // Rolling
                var rollingSpecs = {
                  left: windowWidth - 830,
                  top: windowHeight - 490,
                  width: 400,
                  height: 323
                };
                // InGame
                var ingameSpecs = {
                  left: parseInt((windowWidth - 1200) / 2),
                  top: parseInt((windowHeight - 700) / 2),
                  width: 1200,
                  height: 695
                };
                // Team
                // var teamSpecs = {
                // 	left: 0,
                // 	top: 0,
                // 	width: 420,
                // 	height: 600
                // }
                // Tracker
                var trackerSpecs = {
                  left: 0,
                  top: 0,
                  width: 555,
                  height: 600
                };
                WindowsService.firstLaunch(
                  WindowNames.WINDOWED,
                  windowedSpecs.width,
                  windowedSpecs.height,
                  windowedSpecs.left,
                  windowedSpecs.top
                );
                WindowsService.firstLaunch(
                  WindowNames.ROLLING,
                  rollingSpecs.width,
                  rollingSpecs.height,
                  rollingSpecs.left,
                  rollingSpecs.top
                );
                WindowsService.firstLaunch(
                  WindowNames.IN_GAME,
                  ingameSpecs.width,
                  ingameSpecs.height,
                  ingameSpecs.left,
                  ingameSpecs.top
                );
                WindowsService.firstLaunch(
                  WindowNames.TRACKER,
                  trackerSpecs.width,
                  trackerSpecs.height,
                  trackerSpecs.left,
                  trackerSpecs.top
                );
                // WindowsService.firstLaunch(WindowNames.TEAM, teamSpecs.width, teamSpecs.height, teamSpecs.left, teamSpecs.top);
                // WindowsService.firstLaunch(WindowNames.CUSTOMTEAM, teamSpecs.width, teamSpecs.height, teamSpecs.left, teamSpecs.top);
                localStorage.setItem("firstLaunch", "firstLaunch Completed");
              }
              BackgroundController._registerHotkeys();
              overwolf.windows.getWindowState("loading", function(result) {
                if (result.status === "success") {
                  if (result.window_state === "minimized") {
                    if (localStorage.getItem("itemsWindow") === "enabled") {
                      WindowsService.restore(WindowNames.WINDOWED);
                    }
                    if (localStorage.getItem("rollingWindow") === "enabled") {
                      WindowsService.restore(WindowNames.ROLLING);
                    }
                    if (localStorage.getItem("trackerWindow") === "enabled") {
                      WindowsService.restore(WindowNames.TRACKER);
                    }
                  } else {
                    overwolf.windows.sendMessage(
                      "loading",
                      "phase",
                      "ready",
                      function(response) {
                        if (response.status === "error") {
                        } else if (response.status === "success") {
                        }
                      }
                    );
                  }
                } else {
                  console.log("cant get window state");
                }
              });
              if (notice) {
                WindowsService.restore(WindowNames.NOTICE);
              }
            }, 22000);
          } else if (info.res.game_info.queueId === "n/a") {
            console.log("QueueId returned n/a, trying again");
            setTimeout(getGameQueueId, 1000);
          } else {
            console.log("QueueId did not match TFT, closing program");
            window.close();
          }
        }
        // Try GetInfo until it works
        else if (info.status === "error") {
          console.log("Could not getInfo, retrying");
          setTimeout(getGameQueueId, 1000);
        }
      });
    }
    // Setting Launcher Features
    var g_interestedInFeatures = ["end_game", "game_info"];
    // Setting Game Features
    var g_interestedInGameFeatures = [
      "gameMode",
      "matchState",
      "match_info",
      "me",
      "roster",
      "store",
      "board",
      "bench",
      "carousel"
    ];
    function setFeatures() {
      overwolf.games.launchers.events.setRequiredFeatures(
        10902,
        g_interestedInFeatures,
        function(info) {
          if (info.status === "error") {
            console.log("Could not set required features, trying again");
            window.setTimeout(setFeatures, 2000);
            return;
          }
          // Successfully setting launcher features => Call GetInfo to check QueueId => Open Windows
          console.log("Set launcher required features:" + JSON.stringify(info));
        }
      );
    }
    function setGameFeatures() {
      overwolf.games.events.setRequiredFeatures(
        g_interestedInGameFeatures,
        function(info) {
          if (info.status === "error") {
            console.log("Could not set game required features, trying again");
            window.setTimeout(setGameFeatures, 2000);
            return;
          }
          // Successfully setting game features => Call GetInfo to check QueueId => Open Windows
          getGameQueueId();
          console.log("Set game required features:" + JSON.stringify(info));
        }
      );
    }

    // Fucntion to make sure the launcher is running
    function launcherRunning(launcherInfo) {
      if (!launcherInfo) {
        return false;
      }

      if (!launcherInfo.launchers[0]) {
        return false;
      }

      // NOTE: we divide by 10 to get the launcher class id without it's sequence number
      if (Math.floor(launcherInfo.launchers[0].id / 10) !== 10902) {
        return false;
      }

      console.log("League of Legends launcher running");
      return true;
    }
    // Two functions that make sure the game is running
    function gameLaunched(gameInfoResult) {
      if (!gameInfoResult) {
        return false;
      }

      if (!gameInfoResult.gameInfo) {
        return false;
      }

      if (!gameInfoResult.runningChanged && !gameInfoResult.gameChanged) {
        return false;
      }

      if (!gameInfoResult.gameInfo.isRunning) {
        return false;
      }

      // NOTE: we divide by 10 to get the game class id without it's sequence number
      if (Math.floor(gameInfoResult.gameInfo.id / 10) !== 5426) {
        return false;
      }

      console.log("TFT has launched");
      overwolf.games.getRunningGameInfo(function(res) {
        windowHeight = res.logicalHeight;
        windowWidth = res.logicalWidth;
        console.log(
          "screen height: " + windowHeight,
          "screen width: " + windowWidth
        );
      });
      return true;
    }
    function gameRunning(gameInfo) {
      if (!gameInfo) {
        return false;
      }

      if (!gameInfo.isRunning) {
        return false;
      }

      // NOTE: we divide by 10 to get the game class id without it's sequence number
      if (Math.floor(gameInfo.id / 10) !== 5426) {
        return false;
      }

      console.log("TFT is running");
      overwolf.games.getRunningGameInfo(function(res) {
        windowHeight = res.height;
        windowWidth = res.width;
        console.log(
          "screen height: " + windowHeight,
          "screen width: " + windowWidth
        );
      });
      return true;
    }

    // Putting everything together => Is launcher running? => Register events => Get queueId => Open windows
    overwolf.games.launchers.onLaunched.addListener(function() {
      registerEvents();
      setTimeout(setFeatures, 1000);
      console.log("onLaunched fired");
    });
    overwolf.games.launchers.getRunningLaunchersInfo(function(res) {
      if (launcherRunning(res)) {
        registerEvents();
        setTimeout(setFeatures, 1000);
      }
      console.log("getRunningLaunchersInfo: " + JSON.stringify(res));
    });
    overwolf.games.launchers.onTerminated.addListener(function(res) {
      console.log("onTerminated fired");
      setTimeout(window.close, 1000);
    });
    // Putting everything together => Is game running? => Register events => Get queueId => Open windows
    overwolf.games.onGameInfoUpdated.addListener(function(res) {
      if (gameLaunched(res)) {
        registerGameEvents();
        setTimeout(setGameFeatures, 1000);
      }
    });
    overwolf.games.getRunningGameInfo(function(res) {
      if (gameRunning(res)) {
        registerGameEvents();
        setTimeout(setGameFeatures, 1000);
      }
    });
  }

  // Clicking app in the dock behavior
  static _registerAppLaunchTriggerHandler() {
    overwolf.extensions.onAppLaunchTriggered.removeListener(
      BackgroundController._onAppRelaunch
    );
    overwolf.extensions.onAppLaunchTriggered.addListener(
      BackgroundController._onAppRelaunch
    );
  }

  static _onAppRelaunch() {
    WindowsService.restore(WindowNames.IN_GAME);
  }

  // Hotkeys
  static _registerHotkeys() {
    HotkeysService.setToggleWindowsHotkey(async () => {
      let windowedState = await WindowsService.getWindowState(
        WindowNames.WINDOWED
      );
      let ingameState = await WindowsService.getWindowState(
        WindowNames.IN_GAME
      );
      let trackerState = await WindowsService.getWindowState(
        WindowNames.TRACKER
      );
      let rollingState = await WindowsService.getWindowState(
        WindowNames.ROLLING
      );
      if (
        windowedState === "normal" ||
        ingameState === "normal" ||
        trackerState === "normal" ||
        rollingState === "normal" ||
        (windowedState === "maximized" ||
          ingameState === "maximized" ||
          trackerState === "maximized" ||
          rollingState === "maximized")
      ) {
        WindowsService.hide(WindowNames.WINDOWED);
        WindowsService.hide(WindowNames.IN_GAME);
        WindowsService.hide(WindowNames.TRACKER);
        // WindowsService.hide(WindowNames.TEAM)
        // WindowsService.hide(WindowNames.CUSTOMTEAM)
        WindowsService.hide(WindowNames.ROLLING);
        WindowsService.hide(WindowNames.LOADING);
      } else {
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
    });
    HotkeysService.setToggleDatabaseHotkey(async () => {
      let ingameState = await WindowsService.getWindowState(
        WindowNames.IN_GAME
      );
      if (
        ingameState === "minimized" ||
        ingameState === "closed" ||
        ingameState === "hidden"
      ) {
        WindowsService.restore(WindowNames.IN_GAME);
      } else if (ingameState === "normal" || ingameState === "maximized") {
        WindowsService.hide(WindowNames.IN_GAME);
      }
    });
  }
}

export default BackgroundController;
