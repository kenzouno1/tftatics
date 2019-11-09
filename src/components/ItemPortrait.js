// Utilities
import React, { Component } from "react";
import Tooltip from "rc-tooltip";

export class ItemPortrait extends Component {
  render() {
    return (
      <Tooltip
        placement={this.props.pos ? this.props.pos : "top"}
        mouseEnterDelay={0.3}
        mouseLeaveDelay={0.3}
        overlay={
          <div
            className={
              "item-overlay " +
              (this.props.res ? this.props.res : "") +
              (this.props.window ? " " + this.props.window : "")
            }
          >
            <div className="overlay-title">
              <img
                className="overlay-icon"
                src={
                  "https://rerollcdn.com/items/" +
                  this.props.item.name
                    .replace(/ /g, "")
                    .replace(/\./g, "")
                    .replace(/'/g, "") +
                  ".png"
                }
                alt={this.props.item.name}
              ></img>
              <div className="overlay-bonus-title">
                {this.props.lang === "en"
                  ? this.props.item.name
                  : this.props.item.name_ch}
                <div className="item-stats-wrapper">
                  {this.props.item.stats
                    ? Object.keys(this.props.item.stats).map(function(key) {
                        var stat = this.props.item.stats[key];
                        return (
                          <div className="item-stats" key={key}>
                            <img
                              className="item-stat-icon"
                              src={require("../images/ui/icon-" +
                                stat.name +
                                ".svg")}
                              alt={stat.name}
                            ></img>
                            +{stat.value}
                          </div>
                        );
                      }, this)
                    : null}
                </div>
              </div>
            </div>
            <div className="overlay-bonus-list">
              {this.props.lang === "en"
                ? Object.keys(this.props.item.bonus).map(function(key) {
                    var bonus = this.props.item.bonus[key];
                    return (
                      <div className="overlay-bonus-item" key={bonus}>
                        {bonus}
                      </div>
                    );
                  }, this)
                : Object.keys(this.props.item.bonus_ch).map(function(key) {
                    var bonus = this.props.item.bonus_ch[key];
                    return (
                      <div className="overlay-bonus-item" key={bonus}>
                        {bonus}
                      </div>
                    );
                  }, this)}
            </div>
            {this.props.item.name !== "Neeko's Help" ? (
              this.props.item.combine ? (
                <div className="overlay-recipe">
                  {this.props.lang === "en" ? "Recipe:" : "合成路径"}
                  {Object.keys(this.props.item.combine).map(function(key) {
                    var itemC = this.props.item.combine[key];
                    return (
                      <img
                        className="character-icon"
                        src={
                          "https://rerollcdn.com/items/" +
                          itemC
                            .replace(/ /g, "")
                            .replace(/\./g, "")
                            .replace(/'/g, "") +
                          ".png"
                        }
                        alt={itemC}
                        key={key}
                      ></img>
                    );
                  }, this)}
                </div>
              ) : (
                <div className="overlay-recipe">
                  {this.props.lang === "en" ? "Into:" : "成"}
                  {Object.keys(this.props.item.into).map(function(key) {
                    var itemC = this.props.item.into[key];
                    return (
                      <img
                        className="character-icon"
                        src={
                          "https://rerollcdn.com/items/" +
                          itemC
                            .replace(/ /g, "")
                            .replace(/\./g, "")
                            .replace(/'/g, "") +
                          ".png"
                        }
                        alt={itemC}
                        key={key}
                      ></img>
                    );
                  }, this)}
                </div>
              )
            ) : null}
            {Object.keys(this.props.patchJSON).map(function(key, index) {
              var patchNote = this.props.patchJSON[key];
              if (key === this.props.item.name) {
                return (
                  <div className="overlay-patch">
                    {"Buff" in patchNote ? (
                      <ul className="overlay-patch-buff">
                        Buffs:
                        {Object.keys(patchNote.Buff).map(function(key) {
                          var patchDetails = patchNote.Buff[key];
                          return (
                            <li className="overlay-patch-notes">
                              {patchDetails}
                            </li>
                          );
                        }, this)}
                      </ul>
                    ) : null}
                    {"Nerf" in patchNote ? (
                      <ul className="overlay-patch-nerf">
                        Nerfs:
                        {Object.keys(patchNote.Nerf).map(function(key) {
                          var patchDetails = patchNote.Nerf[key];
                          return (
                            <li className="overlay-patch-notes">
                              {patchDetails}
                            </li>
                          );
                        }, this)}
                      </ul>
                    ) : null}
                  </div>
                );
              }
              return null;
            }, this)}
          </div>
        }
        align={{ offset: [0, -5] }}
        key={this.props.item.name}
      >
        {this.props.simple ? (
          <img
            className="combo-list-icon final"
            src={
              "https://rerollcdn.com/items/" +
              this.props.item.name
                .replace(/ /g, "")
                .replace(/\./g, "")
                .replace(/'/g, "") +
              ".png"
            }
            alt={this.props.item.name}
          ></img>
        ) : (
          <div
            className={
              "characters-item" +
              (this.props.base ? " base" : "") +
              (this.props.tier
                ? (this.props.item.tier_up ? " up" : "") +
                  (this.props.item.tier_down ? " down" : "")
                : "")
            }
          >
            <div
              className="character-wrapper"
              name={this.props.item.name}
              type={this.props.item.into ? "Base" : "Combined"}
              onClick={this.props.selectItem}
            >
              <img
                className={
                  "character-icon" +
                  (this.props.activeItem === this.props.item.name
                    ? " selected"
                    : "")
                }
                src={
                  "https://rerollcdn.com/items/" +
                  this.props.item.name
                    .replace(/ /g, "")
                    .replace(/\./g, "")
                    .replace(/'/g, "") +
                  ".png"
                }
                alt={this.props.item.name}
              ></img>
            </div>
          </div>
        )}
      </Tooltip>
    );
  }
}
