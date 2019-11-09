import React, { Component } from "react";
import Tooltip from "rc-tooltip";
// TFT
// Components
import { CharacterPortrait } from "../components/CharacterPortrait";
import { OriginPortrait } from "../components/OriginPortrait";
import { TypePortrait } from "../components/TypePortrait";

export class MatchHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTopic: "Matches",
      shownGames: 10
    };
    this.setTopic = this.setTopic.bind(this);
    this.loadMatches = this.loadMatches.bind(this);
  }

  setTopic(e) {
    this.setState({
      activeTopic: e.currentTarget.attributes.topic.value
    });
  }

  loadMatches() {
    this.setState({
      shownGames: this.state.shownGames + 10
    });
  }

  componentDidMount() {
    this.props.clearNew();
  }

  render() {
    var options = { year: "2-digit", month: "short", day: "numeric" };

    function isEmpty(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
      }
      return true;
    }

    function ordinal_suffix_of(i) {
      var j = i % 10,
        k = i % 100;
      if (j === 1 && k !== 11) {
        return i + "st Place";
      }
      if (j === 2 && k !== 12) {
        return i + "nd Place";
      }
      if (j === 3 && k !== 13) {
        return i + "rd Place";
      }
      return i + "th Place";
    }

    var totalGames = 0;
    var totalWins = 0;
    var totalFour = 0;
    var avgRank = 0;
    var champions = {};
    var traits = {};
    var tenMatches = [];
    var mostChampion = [];
    var mostTrait = [];
    if (this.props.matchHistory.length > 0) {
      Object.keys(this.props.matchHistory).map(function(key) {
        var match = this.props.matchHistory[key];
        totalGames += 1;
        avgRank += match.rank;
        if (match.rank === 1) {
          totalWins += 1;
        }
        if (match.rank <= 4) {
          totalFour += 1;
        }
        if (totalGames <= this.state.shownGames) {
          tenMatches.push(match);
        }
        // Get Champion Count
        Object.keys(match.chessList).map(function(key) {
          var championCount = match.chessList[key];
          if (championCount in champions) {
            champions[championCount] += 1;
          } else {
            champions[championCount] = 1;
          }
          return null;
        }, this);
        // Get Trait Count
        Object.keys(match.bonusData).map(function(key) {
          var traitCount = match.bonusData[key];
          if (traitCount in traits) {
            traits[traitCount] += 1;
          } else {
            traits[traitCount] = 1;
          }
          return null;
        }, this);
        return null;
      }, this);
      if (isEmpty(champions)) {
      } else {
        var champion1 = Object.keys(champions).reduce(function(a, b) {
          return champions[a] > champions[b] ? a : b;
        });
        delete champions[champion1];
        var champion2 = Object.keys(champions).reduce(function(a, b) {
          return champions[a] > champions[b] ? a : b;
        });
        mostChampion.push(champion1, champion2);
      }
      if (isEmpty(traits)) {
      } else {
        var trait1 = Object.keys(traits).reduce(function(a, b) {
          return traits[a] > traits[b] ? a : b;
        });
        delete traits[trait1];
        var trait2 = Object.keys(traits).reduce(function(a, b) {
          return traits[a] > traits[b] ? a : b;
        });
        mostTrait.push(trait1, trait2);
      }
    }

    return (
      <main className="history">
        <div className="sidebar">
          {this.props.apiStatus ? (
            this.props.lastMatch ? (
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
                      {Math.round((avgRank / totalGames) * 10) / 10}
                    </div>
                    <div className="placement-title">
                      {this.props.lang === "en" ? "Avg Place" : "平均排名"}
                    </div>
                  </div>
                </div>
                <div className="sidebar-stats">
                  <div className="sidebar-stat">
                    <div className="stat-title">
                      {this.props.lang === "en" ? "Games Played" : "玩过的游戏"}
                    </div>
                    <div className="stat-value">{totalGames}</div>
                  </div>
                  <div className="sidebar-stat">
                    <div className="stat-title">
                      {this.props.lang === "en" ? "Wins" : "获胜"}
                    </div>
                    <div className="stat-bar">
                      <span
                        className="bar-fill"
                        style={{
                          width:
                            Math.round((totalWins * 100) / totalGames) + "%"
                        }}
                      ></span>
                    </div>
                    <div className="stat-value">
                      {totalWins}{" "}
                      <span>
                        ({Math.round((totalWins / totalGames) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="sidebar-stat">
                    <div className="stat-title">
                      {this.props.lang === "en" ? "Top 4s" : "前四名"}
                    </div>
                    <div className="stat-bar">
                      <span
                        className="bar-fill"
                        style={{
                          width:
                            Math.round((totalFour * 100) / totalGames) + "%"
                        }}
                      ></span>
                    </div>
                    <div className="stat-value">
                      {totalFour}{" "}
                      <span>
                        ({Math.round((totalFour / totalGames) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="sidebar-stat alt">
                    <div className="stat-title">
                      {this.props.lang === "en" ? "Top Champions" : "第一名"}
                    </div>
                    <div className="stat-value">
                      {Object.keys(mostChampion).map(function(key) {
                        var teamCharacter = mostChampion[key];
                        if (parseInt(key) + 1 === mostTrait.length) {
                          return teamCharacter.replace(/_/g, " ") + "★";
                        } else {
                          return teamCharacter.replace(/_/g, " ") + "★, ";
                        }
                      }, this)}
                    </div>
                  </div>
                  <div className="sidebar-stat alt">
                    <div className="stat-title">
                      {this.props.lang === "en" ? "Top Traits" : "羁绊"}
                    </div>
                    <div className="stat-value">
                      {Object.keys(mostTrait).map(function(key) {
                        var traitName = mostTrait[key];
                        if (parseInt(key) + 1 === mostTrait.length) {
                          return traitName.replace(/_/g, " ");
                        } else {
                          return traitName.replace(/_/g, " ") + ", ";
                        }
                      }, this)}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : null
          ) : null}
        </div>

        <div className="main main-wrapper">
          <div className="header-wrapper">
            {this.props.apiStatus ? (
              <React.Fragment>
                <h1>
                  {this.props.lang === "en" ? "Match History" : "历史战绩"}
                </h1>
                {/* <div className="header-wrapper-group">
                                    <h4>{ this.props.lang === 'en' ? 'Last 10 Matches' : '最近10场比赛' }</h4>
                                    <Tooltip placement="top" mouseEnterDelay={0.3} mouseLeaveDelay={0.3} 
                                        overlay={
                                            <div className="recap-tooltip">{ this.props.lang === 'en' ? 'It can take several minutes for your last match to appear.' : '你的最后一场比赛可能需要稍等几分钟才能看到。' }</div>
                                        } 
                                        align={{offset: [0, 0]}}>
                                            <div className="icon info">
                                                <img src={require('../images/ui/icon-info.svg')} alt='info'></img>
                                            </div>
                                    </Tooltip>
                                </div> */}
                <div className="btns">
                  <div
                    className={"btn" + (this.props.allowGet ? "" : " disabled")}
                    onClick={this.props.refreshHistory}
                  >
                    {this.props.lang === "en" ? "Refresh Data" : "刷新数据"}
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <h1>
                {this.props.lang === "en"
                  ? "Match History is currently unavailable."
                  : "历史战绩暂时无法获取"}
              </h1>
            )}
          </div>
          {this.props.apiStatus ? (
            totalGames === 0 ? (
              <div className="data-warning">
                {this.props.lang === "en"
                  ? "Looks like you haven't played a match using TFtactics yet!"
                  : "看来你还没有使用TFtactics完成过比赛！"}
              </div>
            ) : (
              <React.Fragment>
                <div className="graph-nav">
                  <div
                    className={
                      "graph-nav-item" +
                      (this.state.activeTopic === "Matches" ? " active" : "")
                    }
                    topic={"Matches"}
                    onClick={this.setTopic}
                  >
                    {this.props.lang === "en" ? "Matches" : "玩过的游戏"}
                  </div>
                  <Tooltip
                    placement="top"
                    overlay={
                      <div className="recap-tooltip">
                        {this.props.lang === "en" ? "Coming soon..." : "快来了"}
                      </div>
                    }
                    align={{ offset: [0, 0] }}
                  >
                    <div
                      className={
                        "graph-nav-item disabled" +
                        (this.state.activeTopic === "Stats" ? " active" : "")
                      }
                      topic={"Stats"}
                    >
                      {this.props.lang === "en" ? "Stats" : "统计"}
                    </div>
                  </Tooltip>
                </div>
                <div className="history-summary">
                  <div className="summary-placements">
                    <div className="summary-title">
                      {this.props.lang === "en" ? "Placements" : "排名展示"}
                    </div>
                    <div className="summary-content">
                      {Object.keys(tenMatches).map(function(key) {
                        var comp = tenMatches[key];
                        return (
                          <div className={"summary-rank r" + comp.rank}>
                            {comp.rank}
                          </div>
                        );
                      }, this)}
                    </div>
                  </div>
                </div>
                <div className="history-matches">
                  {Object.keys(tenMatches).map(function(key) {
                    var comp = tenMatches[key];
                    var date = new Date(comp.date);
                    return (
                      <div className="history-match">
                        <div className={"match-rank r" + comp.rank}>
                          <div className="match-placement">
                            {ordinal_suffix_of(comp.rank)}
                          </div>
                          <div className="match-details">
                            {comp.ranked ? "Ranked" : "Normal"} •{" "}
                            {date.toLocaleDateString("en-US", options)}
                          </div>
                        </div>
                        <div className="match-content">
                          <div className="match-characters">
                            {Object.keys(comp.chessList).map(function(key) {
                              var teamCharacter = comp.chessList[key];
                              return Object.keys(this.props.charactersJSON).map(
                                function(key) {
                                  var character = this.props.charactersJSON[
                                    key
                                  ];
                                  var items = null;
                                  if (comp.itemList) {
                                    Object.keys(comp.itemList).map(function(
                                      key
                                    ) {
                                      var itemChamp = comp.itemList[key];
                                      if (
                                        itemChamp.unit
                                          .toLowerCase()
                                          .replace(/'/, "")
                                          .replace(/_.(?=[^_]*$)/, "")
                                          .replace(/_/g, " ") ===
                                        character.name.toLowerCase()
                                      ) {
                                        items = itemChamp.items;
                                      }
                                      return null;
                                    },
                                    this);
                                  }
                                  if (character.active) {
                                    if (
                                      character.set.includes(
                                        parseInt(this.props.set)
                                      )
                                    ) {
                                      if (
                                        character.name.toLowerCase() ===
                                        teamCharacter
                                          .toLowerCase()
                                          .replace(/'/, "")
                                          .replace(/_.(?=[^_]*$)/, "")
                                          .replace(/_/g, " ")
                                      ) {
                                        return (
                                          <CharacterPortrait
                                            character={character}
                                            level={teamCharacter.replace(
                                              /.*_/,
                                              ""
                                            )}
                                            key={key}
                                            patchJSON={this.props.patchJSON}
                                            lang={this.props.lang}
                                            set={this.props.set}
                                            history={items ? true : null}
                                            itemsJSON={this.props.itemsJSON}
                                            items={items ? items : null}
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
                          <div className="match-traits">
                            {Object.keys(comp.bonusData).map(function(key) {
                              var traitFull = comp.bonusData[key];
                              var traitName = comp.bonusData[key].replace(
                                /_.*/,
                                ""
                              );
                              var traitCount = comp.bonusData[key].replace(
                                /.*_/,
                                ""
                              );
                              return (
                                <React.Fragment>
                                  {Object.keys(this.props.originsJSON).map(
                                    function(key) {
                                      var origin = this.props.originsJSON[key];
                                      if (origin.name === traitName) {
                                        var dataArr = {};
                                        dataArr[origin.name] = parseInt(
                                          traitCount
                                        );
                                        return origin.name === traitName ? (
                                          <OriginPortrait
                                            origin={origin}
                                            builder={true}
                                            data={dataArr}
                                            charactersJSON={
                                              this.props.charactersJSON
                                            }
                                            history={true}
                                            count={traitFull}
                                            key={key}
                                            patchJSON={this.props.patchJSON}
                                            lang={this.props.lang}
                                            set={this.props.set}
                                          ></OriginPortrait>
                                        ) : null;
                                      }
                                      return null;
                                    },
                                    this
                                  )}
                                  {Object.keys(this.props.typesJSON).map(
                                    function(key) {
                                      var type = this.props.typesJSON[key];
                                      if (type.name === traitName) {
                                        var dataArr = {};
                                        dataArr[type.name] = parseInt(
                                          traitCount
                                        );
                                        return type.name === traitName ? (
                                          <TypePortrait
                                            type={type}
                                            builder={true}
                                            data={dataArr}
                                            charactersJSON={
                                              this.props.charactersJSON
                                            }
                                            history={true}
                                            count={traitFull}
                                            key={key}
                                            patchJSON={this.props.patchJSON}
                                            lang={this.props.lang}
                                            set={this.props.set}
                                          ></TypePortrait>
                                        ) : null;
                                      }
                                      return null;
                                    },
                                    this
                                  )}
                                </React.Fragment>
                              );
                            }, this)}
                          </div>
                        </div>
                      </div>
                    );
                  }, this)}
                </div>
                {totalGames > this.state.shownGames ? (
                  <div className="btn match-load" onClick={this.loadMatches}>
                    Load More
                  </div>
                ) : null}
              </React.Fragment>
            )
          ) : (
            <p>
              {this.props.lang === "en"
                ? "The service might be down for maintenance or having technical difficulties. We are trying to resolve it as quickly as possible."
                : "服务可能会因为维护或技术问题而中断。我们正在努力并且会尽快解决这个问题。"}
            </p>
          )}
        </div>
      </main>
    );
  }
}
