import React, { Component } from "react";
import { Line, HorizontalBar } from "react-chartjs-2";
// Components
import CharacterPortrait from "../components/CharacterPortrait";
import { withTranslation } from "react-i18next";
class MatchRecap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: "Level",
      activeTopic: "Champions"
    };
    this.setCategory = this.setCategory.bind(this);
    this.setTopic = this.setTopic.bind(this);
  }

  setCategory(e) {
    this.setState({
      activeCategory: e.currentTarget.attributes.category.value
    });
  }

  setTopic(e) {
    this.setState({
      activeTopic: e.currentTarget.attributes.topic.value
    });
  }

  render() {
    const { t } = this.props;
    function ordinal_suffix_of(i) {
      var j = i % 10,
        k = i % 100;
      if (j === 1 && k !== 11) {
        return i + "st";
      }
      if (j === 2 && k !== 12) {
        return i + "nd";
      }
      if (j === 3 && k !== 13) {
        return i + "rd";
      }
      return i + "th";
    }

    // Chart
    const health = {
      labels: [],
      datasets: []
    };
    const level = {
      labels: [],
      datasets: []
    };
    const wins = {
      labels: [],
      datasets: []
    };
    const gold = {
      labels: [],
      datasets: []
    };
    const damage = {};
    const options = {
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: t("Rounds"),
              fontColor: "rgba(255,255,255,0.57)"
            },
            ticks: {
              fontColor: "rgba(255,255,255,0.57)"
            },
            gridLines: {
              display: false,
              color: "#1b2d33"
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              fontColor: "rgba(255,255,255,0.57)",
              precision: 0
            },
            gridLines: {
              display: false,
              color: "#1b2d33"
            }
          }
        ]
      },
      legend: {
        labels: {
          boxWidth: 8,
          fontColor: "rgba(255,255,255,0.57)",
          padding: 15,
          usePointStyle: true
        }
      },
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "#0f2d38",
        displayColors: false,
        xPadding: 15,
        yPadding: 10
      }
    };

    var loseStreak = 0;
    var winStreak = 0;
    var mostGold = 0;
    var roundsWon = 0;
    var roundsLost = 0;
    var placement = 0;
    var currentWins = 0;
    var currentLoses = 0;

    var colors = [
      "rgba(244,67,54,0.5)",
      "rgba(156,39,176,0.5)",
      "rgba(63,81,181,0.5)",
      "rgba(33,150,243,0.5)",
      "rgba(76,175,80,0.5)",
      "rgba(255,235,59,0.5)",
      "rgba(121,85,72,0.5)",
      "rgba(96,125,139,0.5)"
    ];

    if (this.props.matchData) {
      Object.keys(this.props.matchData).map(function(key, index) {
        var name = key;
        var player = this.props.matchData[key];
        var healthData = [];
        var levelData = [];
        var winsData = [];
        var labelData = [];
        var healthDataset = {};
        var levelDataset = {};
        var winsDataset = {};
        var roundWins = 0;
        if (name === this.props.summonerName) {
          var goldData = [];
          var goldDataset = {};
          Object.keys(player).map(function(key) {
            var playerData = player[key];
            labelData.push(key);
            healthData.push(playerData.health);
            levelData.push(playerData.level);
            goldData.push(playerData.gold);
            placement = playerData.rank;
            if (parseInt(playerData.gold) > parseInt(mostGold)) {
              mostGold = playerData.gold;
            }
            if (playerData.outcome === "victory") {
              currentLoses = 0;
              currentWins += 1;
              roundsWon += 1;
              roundWins += 1;
              if (currentWins > winStreak) {
                winStreak = currentWins;
              }
            }
            if (playerData.outcome === "defeat") {
              currentWins = 0;
              currentLoses += 1;
              roundsLost += 1;
              if (currentLoses > loseStreak) {
                loseStreak = currentLoses;
              }
            }
            winsData.push(roundWins);
            if ("damage" in playerData) {
              Object.keys(playerData.damage).map(function(key) {
                var characterDamage = playerData.damage[key];
                if (
                  characterDamage.name
                    .replace("TFT_", "")
                    .replace("TFT2_", "")
                    .replace(/_/g, " ") in damage
                ) {
                  damage[
                    characterDamage.name
                      .replace("TFT_", "")
                      .replace("TFT2_", "")
                      .replace(/_/g, " ")
                  ] += characterDamage.damage;
                } else {
                  damage[
                    characterDamage.name
                      .replace("TFT_", "")
                      .replace("TFT2_", "")
                      .replace(/_/g, " ")
                  ] = characterDamage.damage;
                }
                return null;
              });
            }
            return null;
          }, this);
          healthDataset = {
            data: healthData,
            label: key,
            borderColor: "#d47559",
            borderWidth: 5,
            pointRadius: 5,
            pointBackgroundColor: "#FFF",
            pointBorderWidth: 0,
            backgroundColor: "#d47559",
            fill: false,
            lineTension: 0
          };
          levelDataset = {
            data: levelData,
            label: key,
            borderColor: "#d47559",
            borderWidth: 5,
            pointRadius: 5,
            pointBackgroundColor: "#FFF",
            pointBorderWidth: 0,
            backgroundColor: "#d47559",
            fill: false,
            lineTension: 0
          };
          winsDataset = {
            data: winsData,
            label: key,
            borderColor: "#d47559",
            borderWidth: 5,
            pointRadius: 5,
            pointBackgroundColor: "#FFF",
            pointBorderWidth: 0,
            backgroundColor: "#d47559",
            fill: false,
            lineTension: 0
          };
          goldDataset = {
            data: goldData,
            label: key,
            borderColor: "#d47559",
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: "#FFF",
            pointBorderWidth: 0,
            backgroundColor: "#d47559",
            fill: false,
            lineTension: 0
          };
          if (health.labels.length <= labelData.length) {
            health.labels = labelData;
          }
          if (level.labels.length <= labelData.length) {
            level.labels = labelData;
          }
          if (gold.labels.length <= labelData.length) {
            gold.labels = labelData;
          }
          health.datasets.unshift(healthDataset);
          level.datasets.unshift(levelDataset);
          wins.datasets.unshift(winsDataset);
          gold.datasets.push(goldDataset);
        } else {
          Object.keys(player).map(function(key) {
            var playerData = player[key];
            labelData.push(key);
            healthData.push(playerData.health);
            levelData.push(playerData.level);
            if (playerData.outcome === "victory") {
              roundWins += 1;
            }
            winsData.push(roundWins);
            return null;
          }, this);
          healthDataset = {
            data: healthData,
            label: key,
            borderColor: colors[index],
            borderWidth: 2,
            pointRadius: 0,
            pointBackgroundColor: colors[index],
            pointBorderWidth: 0,
            backgroundColor: colors[index],
            fill: false,
            lineTension: 0
          };
          levelDataset = {
            data: levelData,
            label: key,
            borderColor: colors[index],
            borderWidth: 2,
            pointRadius: 0,
            pointBackgroundColor: colors[index],
            pointBorderWidth: 0,
            backgroundColor: colors[index],
            fill: false,
            lineTension: 0
          };
          winsDataset = {
            data: winsData,
            label: key,
            borderColor: colors[index],
            borderWidth: 2,
            pointRadius: 0,
            pointBackgroundColor: colors[index],
            pointBorderWidth: 0,
            backgroundColor: colors[index],
            fill: false,
            lineTension: 0
          };
          if (health.labels.length <= labelData.length) {
            health.labels = labelData;
          }
          if (level.labels.length <= labelData.length) {
            level.labels = labelData;
          }
          if (wins.labels.length <= labelData.length) {
            wins.labels = labelData;
          }
          health.datasets.push(healthDataset);
          level.datasets.push(levelDataset);
          wins.datasets.push(winsDataset);
        }
        return null;
      }, this);
    }

    const tableDamage = {
      labels: [],
      datasets: [
        {
          label: t("Overall Damage"),
          data: [],
          backgroundColor: "#d47559"
        }
      ]
    };

    var damageKeys = Object.keys(damage);
    damageKeys.sort(function(a, b) {
      return damage[b] - damage[a];
    });

    var damageValues = [];
    Object.keys(damage).map(function(key) {
      var championDamage = damage[key];
      damageValues.push(championDamage);
      return null;
    });
    damageValues.sort(function(a, b) {
      return b - a;
    });

    tableDamage.labels = damageKeys;
    tableDamage.datasets[0].data = damageValues;

    return (
      <main className="match-recap">
        <div className="sidebar">
          {this.props.apiStatus && this.props.gepStatus !== "3" ? (
            <React.Fragment>
              <div className="sidebar-header">
                <div className="summoner-details">
                  {this.props.tier ? (
                    <img
                      className="summoner-rank"
                      src={require("../images/ui/rank-" +
                        this.props.tier.toLowerCase() +
                        ".png")}
                      alt={this.props.tier}
                    ></img>
                  ) : null}
                  <div className="summoner-info">
                    <div className="summoner-name">
                      {this.props.summonerName}
                    </div>
                    <div className="summoner-tier">
                      {this.props.tier && this.props.division
                        ? this.props.tier !== "null"
                          ? this.props.division !== "NA"
                            ? this.props.tier.toLowerCase() +
                              " " +
                              this.props.division
                            : this.props.tier.toLowerCase()
                          : "Unranked"
                        : "Unranked"}
                    </div>
                  </div>
                </div>
                <div className="match-placement">
                  <div className="placement-value">
                    {ordinal_suffix_of(placement)}
                  </div>
                  <div className="placement-title">{t("Place")}</div>
                </div>
              </div>
              <div className="sidebar-stats">
                <div className="sidebar-stat">
                  <div className="stat-title">{t("Wins")}</div>
                  <div className="stat-bar">
                    <span
                      className="bar-fill"
                      style={{
                        width:
                          Math.round(
                            (roundsWon * 100) / (roundsWon + roundsLost)
                          ) + "%"
                      }}
                    ></span>
                  </div>
                  <div className="stat-value">{roundsWon}</div>
                </div>
                <div className="sidebar-stat">
                  <div className="stat-title">{t("Losses")}</div>
                  <div className="stat-bar">
                    <span
                      className="bar-fill"
                      style={{
                        width:
                          Math.round(
                            (roundsLost * 100) / (roundsWon + roundsLost)
                          ) + "%"
                      }}
                    ></span>
                  </div>
                  <div className="stat-value">{roundsLost}</div>
                </div>
                <div className="sidebar-stat">
                  <div className="stat-title">{t("Top Win Streak")}</div>
                  <div className="stat-bar">
                    <span
                      className="bar-fill"
                      style={{
                        width:
                          Math.round(
                            (winStreak * 100) / (roundsWon + roundsLost)
                          ) + "%"
                      }}
                    ></span>
                  </div>
                  <div className="stat-value">{winStreak}</div>
                </div>
                <div className="sidebar-stat">
                  <div className="stat-title">{t("Top Lose Streak")}</div>
                  <div className="stat-bar">
                    <span
                      className="bar-fill"
                      style={{
                        width:
                          Math.round(
                            (loseStreak * 100) / (roundsWon + roundsLost)
                          ) + "%"
                      }}
                    ></span>
                  </div>
                  <div className="stat-value">{loseStreak}</div>
                </div>
                <div className="sidebar-stat">
                  <div className="stat-title">{t("Most Gold")}</div>
                  <div className="stat-bar">
                    <span
                      className="bar-fill"
                      style={{ width: Math.round((mostGold * 100) / 50) + "%" }}
                    ></span>
                  </div>
                  <div className="stat-value">{mostGold}</div>
                </div>
              </div>
            </React.Fragment>
          ) : null}
        </div>
        <div className="main main-wrapper">
          <div className="header-wrapper">
            {this.props.apiStatus && this.props.gepStatus !== "3" ? (
              <React.Fragment>
                <h1>{t("Match Recap")}</h1>
                {this.props.lastMatch && this.props.showTeam ? (
                  <div className="recap-team">
                    {Object.keys(
                      this.props.lastMatch.localPlayer.boardPieces
                    ).map(function(key) {
                      var teamCharacter = this.props.lastMatch.localPlayer
                        .boardPieces[key];
                      return Object.keys(this.props.charactersJSON).map(
                        function(key) {
                          var character = this.props.charactersJSON[key];
                          if (character.active) {
                            if (
                              character.set.includes(parseInt(this.props.set))
                            ) {
                              if (
                                character.name.toLowerCase() ===
                                teamCharacter.name
                                  .toLowerCase()
                                  .replace(/'/, "")
                                  .replace(/_.*/, "")
                              ) {
                                return (
                                  <CharacterPortrait
                                    character={character}
                                    level={teamCharacter.level}
                                    key={key}
                                    patchJSON={this.props.patchJSON}
                                    lang={this.props.lang}
                                    set={this.props.set}
                                  ></CharacterPortrait>
                                );
                              }
                            }
                          }
                          return null;
                        },
                        this
                      );
                    }, this)}
                  </div>
                ) : null}
              </React.Fragment>
            ) : (
              <h1>{t("Match Recap is currently unavailable.")}</h1>
            )}
          </div>
          {this.props.apiStatus && this.props.gepStatus !== "3" ? (
            this.props.matchData === null ? (
              <div className="data-warning">
                <p>{t("No match found!")}</p>
              </div>
            ) : (
              <React.Fragment>
                <div className="graph-nav">
                  <div
                    className={
                      "graph-nav-item" +
                      (this.state.activeTopic === "Champions" ? " active" : "")
                    }
                    topic={"Champions"}
                    onClick={this.setTopic}
                  >
                    {t("Champions")}
                  </div>
                  {this.props.showTeam ? (
                    <div
                      className={
                        "graph-nav-item" +
                        (this.state.activeTopic === "Summoners"
                          ? " active"
                          : "")
                      }
                      topic={"Summoners"}
                      onClick={this.setTopic}
                    >
                      {t("Summoners")}
                    </div>
                  ) : null}
                </div>
                {this.state.activeTopic === "Summoners" ? (
                  <div className="recap-graph">
                    <div className="graph-chart">
                      <Line
                        data={
                          this.state.activeCategory === "Health"
                            ? health
                            : this.state.activeCategory === "Level"
                            ? level
                            : this.state.activeCategory === "Gold"
                            ? gold
                            : wins
                        }
                        options={options}
                        width="500"
                      />
                    </div>
                    <div className="graph-nav">
                      <div
                        className={
                          "graph-nav-item" +
                          (this.state.activeCategory === "Level"
                            ? " active"
                            : "")
                        }
                        category={"Level"}
                        onClick={this.setCategory}
                      >
                        {t("Level")}
                      </div>
                      <div
                        className={
                          "graph-nav-item" +
                          (this.state.activeCategory === "Health"
                            ? " active"
                            : "")
                        }
                        category={"Health"}
                        onClick={this.setCategory}
                      >
                        {t("Health")}
                      </div>
                      <div
                        className={
                          "graph-nav-item" +
                          (this.state.activeCategory === "Wins"
                            ? " active"
                            : "")
                        }
                        category={"Wins"}
                        onClick={this.setCategory}
                      >
                        {t("Wins")}
                      </div>
                      <div
                        className={
                          "graph-nav-item" +
                          (this.state.activeCategory === "Gold"
                            ? " active"
                            : "")
                        }
                        category={"Gold"}
                        onClick={this.setCategory}
                      >
                        {t("Gold")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="recap-graph">
                    <div className="graph-chart">
                      <HorizontalBar
                        data={tableDamage}
                        options={options}
                        width="500"
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          ) : (
            <p>
              {t(
                "The service might be down for maintenance or having technical difficulties. We are trying to resolve it as quickly as possible."
              )}
            </p>
          )}
        </div>
      </main>
    );
  }
}
export default withTranslation()(MatchRecap);
