// Utilities
import React, { Component } from "react";
import Tooltip from "rc-tooltip";

export class TypePortrait extends Component {
  render() {
    return (
      <Tooltip
        placement="top"
        mouseEnterDelay={0.3}
        mouseLeaveDelay={0.3}
        overlay={
          <div
            className={"builder-overlay" + (this.props.builder ? " tb" : "")}
          >
            <div className="overlay-title">
              <img
                className="overlay-icon"
                src={
                  "https://rerollcdn.com/icons/" +
                  this.props.type.name.replace(/ /g, "").toLowerCase() +
                  ".png"
                }
                alt={this.props.type.name}
              ></img>
              {this.props.lang === "en"
                ? this.props.type.name
                : this.props.type.name_ch}
            </div>
            <div className="overlay-bonus-list">
              {this.props.type.effect ? (
                <div className="overlay-bonus-heading">
                  {this.props.lang === "en"
                    ? this.props.type.effect
                    : this.props.type.effect_ch}
                </div>
              ) : null}
              {this.props.builder
                ? Object.keys(this.props.type.bonus).map(function(key) {
                    var bonus = this.props.type.bonus[key];
                    return this.props.type.name !== "Ninja" ? (
                      this.props.data[this.props.type.name] >= bonus.count ? (
                        <div className="overlay-bonus-item active" key={key}>
                          <div className="overlay-bonus-item-count">
                            {bonus.count}
                          </div>
                          <div className="overlay-bonus-item-value">
                            {bonus.value}
                          </div>
                        </div>
                      ) : (
                        <div className="overlay-bonus-item" key={key}>
                          <div className="overlay-bonus-item-count">
                            {bonus.count}
                          </div>
                          <div className="overlay-bonus-item-value">
                            {bonus.value}
                          </div>
                        </div>
                      )
                    ) : this.props.data[this.props.type.name] === bonus.count ||
                      this.props.data[this.props.type.name] === 4 ? (
                      <div className="overlay-bonus-item active" key={key}>
                        <div className="overlay-bonus-item-count">
                          {bonus.count}
                        </div>
                        <div className="overlay-bonus-item-value">
                          {bonus.value}
                        </div>
                      </div>
                    ) : (
                      <div className="overlay-bonus-item" key={key}>
                        <div className="overlay-bonus-item-count">
                          {bonus.count}
                        </div>
                        <div className="overlay-bonus-item-value">
                          {bonus.value}
                        </div>
                      </div>
                    );
                  }, this)
                : Object.keys(this.props.type.bonus).map(function(key) {
                    var bonus = this.props.type.bonus[key];
                    return (
                      <div className="overlay-bonus-item" key={key}>
                        <div className="overlay-bonus-item-count">
                          {bonus.count}
                        </div>
                        <div className="overlay-bonus-item-value">
                          {bonus.value}
                        </div>
                      </div>
                    );
                  }, this)}
            </div>
            <div className="overlay-recipe">
              {this.props.lang === "en" ? "Champions:" : "英雄详情"}
              {Object.keys(this.props.charactersJSON).map(function(key) {
                var character = this.props.charactersJSON[key];
                if (character.active) {
                  if (character.set.includes(parseInt(this.props.set))) {
                    if (character.type.includes(this.props.type.name)) {
                      return (
                        <div className="characters-item c" key={character.name}>
                          <div className="character-wrapper">
                            <img
                              className="character-icon"
                              src={
                                character.set.includes(1)
                                  ? "https://rerollcdn.com/characters/" +
                                    character.name.replace(/ /g, "") +
                                    ".png"
                                  : "https://rerollcdn.com/characters/" +
                                    this.props.set +
                                    "/" +
                                    character.name.replace(/ /g, "") +
                                    ".png"
                              }
                              alt={character.name}
                            ></img>
                          </div>
                        </div>
                      );
                    }
                  }
                }
                return null;
              }, this)}
            </div>
            {Object.keys(this.props.patchJSON).map(function(key, index) {
              var patchNote = this.props.patchJSON[key];
              if (key === this.props.type.name) {
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
        key={this.props.type.name}
      >
        {this.props.builder ? (
          <div
            className={
              "builder-bonus-item" +
              (this.props.data[this.props.type.name] > 0 ? " active" : "") +
              (this.props.rank ? " " + this.props.rank : "") +
              (this.props.count ? " " + this.props.count : "")
            }
          >
            <div className="builder-bonus-icon">
              <img
                className="type-icon"
                src={
                  "https://rerollcdn.com/icons/" +
                  this.props.type.name.replace(/ /g, "").toLowerCase() +
                  ".png"
                }
                alt={this.props.type.name}
              ></img>
              <div
                className={
                  "builder-bonus-counter" +
                  (this.props.data[this.props.type.name] === 0 ? " hidden" : "")
                }
              >
                <span>{this.props.data[this.props.type.name]}</span>
              </div>
            </div>
            <div className="builder-bonus-count">
              {Object.keys(this.props.type.bonus).map(function(key) {
                var bonus = this.props.type.bonus[key];
                return this.props.type.name !== "Ninja" ? (
                  this.props.data[this.props.type.name] >= bonus.count ? (
                    <div
                      className="builder-bonus-count-bar active"
                      key={key}
                    ></div>
                  ) : (
                    <div className="builder-bonus-count-bar" key={key}></div>
                  )
                ) : this.props.data[this.props.type.name] === bonus.count ||
                  this.props.data[this.props.type.name] === 4 ? (
                  <div
                    className="builder-bonus-count-bar active"
                    key={key}
                  ></div>
                ) : (
                  <div className="builder-bonus-count-bar" key={key}></div>
                );
              }, this)}
            </div>
          </div>
        ) : (
          <div
            className={
              "characters-item" +
              (this.props.tier
                ? (this.props.type.tier_up ? " up" : "") +
                  (this.props.type.tier_down ? " down" : "")
                : "")
            }
            key={this.props.type.name}
            name={this.props.type.name}
            onClick={this.props.selectTrait}
          >
            <div className="character-wrapper">
              <img
                className={
                  "character-icon" +
                  (this.props.activeTrait === this.props.type.name
                    ? " selected"
                    : "")
                }
                src={
                  "https://rerollcdn.com/icons/" +
                  this.props.type.name.replace(/ /g, "").toLowerCase() +
                  ".png"
                }
                alt={this.props.type.name}
              ></img>
              {this.props.tier
                ? this.props.lang === "en"
                  ? this.props.type.name
                  : this.props.type.name_ch
                : null}
            </div>
          </div>
        )}
      </Tooltip>
    );
  }
}
