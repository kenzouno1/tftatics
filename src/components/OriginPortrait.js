// Utilities
import React, { Component } from "react";
import Tooltip from "rc-tooltip";
import { withTranslation } from "react-i18next";
class OriginPortrait extends Component {
  render() {
    const { t } = this.props;
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
                  this.props.origin.name.replace(/ /g, "").toLowerCase() +
                  ".png"
                }
                alt={this.props.origin.name}
              ></img>
              {this.props.lang !== "ch"
                ? this.props.origin.name
                : this.props.origin.name_ch}
            </div>
            <div className="overlay-bonus-list">
              {this.props.origin.effect ? (
                <div className="overlay-bonus-heading">
                  {this.props.lang !== "ch"
                    ? this.props.origin.effect
                    : this.props.origin.effect_ch}
                </div>
              ) : null}
              {this.props.builder
                ? Object.keys(this.props.origin.bonus).map(function(key) {
                    var bonus = this.props.origin.bonus[key];
                    return this.props.origin.name !== "Ninja" ? (
                      this.props.data[this.props.origin.name] >= bonus.count ? (
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
                    ) : this.props.data[this.props.origin.name] === 1 ||
                      this.props.data[this.props.origin.name] === 4 ? (
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
                : Object.keys(this.props.origin.bonus).map(function(key) {
                    var bonus = this.props.origin.bonus[key];
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
              {t("Champions:")}
              {Object.keys(this.props.charactersJSON).map(function(key) {
                var character = this.props.charactersJSON[key];
                if (character.active) {
                  if (character.set.includes(parseInt(this.props.set))) {
                    if (character.origin.includes(this.props.origin.name)) {
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
              if (key === this.props.origin.name) {
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
        key={this.props.origin.name}
      >
        {this.props.builder ? (
          <div
            className={
              "builder-bonus-item" +
              (this.props.data[this.props.origin.name] > 0 ? " active" : "") +
              (this.props.rank ? " " + this.props.rank : "") +
              (this.props.count ? " " + this.props.count : "")
            }
          >
            <div className="builder-bonus-icon">
              <img
                className="origin-icon"
                src={
                  "https://rerollcdn.com/icons/" +
                  this.props.origin.name.replace(/ /g, "").toLowerCase() +
                  ".png"
                }
                alt={this.props.origin.name}
              ></img>
              <div
                className={
                  "builder-bonus-counter" +
                  (this.props.data[this.props.origin.name] === 0
                    ? " hidden"
                    : "")
                }
              >
                <span>{this.props.data[this.props.origin.name]}</span>
              </div>
            </div>
            <div className="builder-bonus-count">
              {Object.keys(this.props.origin.bonus).map(function(key) {
                var bonus = this.props.origin.bonus[key];
                return this.props.origin.name !== "Ninja" ? (
                  this.props.data[this.props.origin.name] >= bonus.count ? (
                    <div
                      className="builder-bonus-count-bar active"
                      key={key}
                    ></div>
                  ) : (
                    <div className="builder-bonus-count-bar" key={key}></div>
                  )
                ) : this.props.data[this.props.origin.name] === bonus.count ||
                  this.props.data[this.props.origin.name] === 4 ? (
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
                ? (this.props.origin.tier_up ? " up" : "") +
                  (this.props.origin.tier_down ? " down" : "")
                : "")
            }
            key={this.props.origin.name}
            name={this.props.origin.name}
            onClick={this.props.selectTrait}
          >
            <div className="character-wrapper">
              <img
                className={
                  "character-icon" +
                  (this.props.activeTrait === this.props.origin.name
                    ? " selected"
                    : "")
                }
                src={
                  "https://rerollcdn.com/icons/" +
                  this.props.origin.name.replace(/ /g, "").toLowerCase() +
                  ".png"
                }
                alt={this.props.origin.name}
              ></img>
              {this.props.tier
                ? this.props.lang !== "ch"
                  ? this.props.origin.name
                  : this.props.origin.name_ch
                : null}
            </div>
          </div>
        )}
      </Tooltip>
    );
  }
}
export default withTranslation()(OriginPortrait);
