// Utilities
import React, { Component } from "react";
import Tooltip from "rc-tooltip";
// Components
import { ItemPortrait } from "./ItemPortrait.js";

export class CharacterPortrait extends Component {
  render() {
    return this.props.builder ? (
      <div
        className={"characters-item c" + this.props.character.cost}
        key={this.props.character.name}
      >
        <Tooltip
          placement="top"
          mouseEnterDelay={0.3}
          mouseLeaveDelay={0.3}
          overlay={
            <div className="character-overlay">
              <div className="character-top">
                <div className="overlay-title">
                  <img
                    className="overlay-icon"
                    src={
                      this.props.character.set.includes(1)
                        ? "https://rerollcdn.com/characters/" +
                          this.props.character.name.replace(/ /g, "") +
                          ".png"
                        : "https://rerollcdn.com/characters/" +
                          this.props.set +
                          "/" +
                          this.props.character.name.replace(/ /g, "") +
                          ".png"
                    }
                    alt={this.props.character.name}
                  ></img>
                  {this.props.lang === "en"
                    ? this.props.character.name
                    : this.props.character.name_ch}
                </div>
                <div className="overlay-bonus-list">
                  {Object.keys(this.props.character.origin).map(function(key) {
                    var origin = this.props.character.origin[key];
                    return (
                      <div className="overlay-bonus-item" key={key}>
                        <img
                          className="overlay-bonus-item-icon"
                          src={
                            "https://rerollcdn.com/icons/" +
                            origin.replace(/ /g, "").toLowerCase() +
                            ".png"
                          }
                          alt={origin}
                        ></img>
                        <div className="overlay-bonus-item-value">{origin}</div>
                      </div>
                    );
                  }, this)}
                  {Object.keys(this.props.character.type).map(function(key) {
                    var type = this.props.character.type[key];
                    return (
                      <div className="overlay-bonus-item" key={key}>
                        <img
                          className="overlay-bonus-item-icon"
                          src={
                            "https://rerollcdn.com/icons/" +
                            type.replace(/ /g, "").toLowerCase() +
                            ".png"
                          }
                          alt={type}
                        ></img>
                        <div className="overlay-bonus-item-value">{type}</div>
                      </div>
                    );
                  }, this)}
                </div>
                <div className="overlay-cost">
                  <img
                    className="gold-icon"
                    src={require("../images/ui/icon-gold.svg")}
                    alt="cost"
                  ></img>
                  {this.props.character.cost}
                </div>
              </div>
              <div className="overlay-recipe">
                {this.props.lang === "en" ? "Items:" : "装备"}
                {Object.keys(this.props.character.items).map(function(key) {
                  var itemC = this.props.character.items[key];
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
              {Object.keys(this.props.patchJSON).map(function(key, index) {
                var patchNote = this.props.patchJSON[key];
                if (key === this.props.character.name) {
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
          key={origin.name}
        >
          <div
            className={
              "character-wrapper" +
              (this.props.teamArr.includes(this.props.character.id)
                ? " selected"
                : "")
            }
            id={this.props.character.id}
            onClick={
              this.props.teamArr.includes(this.props.character.id)
                ? this.props.removeUnit
                : this.props.addUnit
            }
          >
            <img
              className="character-icon"
              src={
                this.props.character.set.includes(1)
                  ? "https://rerollcdn.com/characters/" +
                    this.props.character.name.replace(/ /g, "") +
                    ".png"
                  : "https://rerollcdn.com/characters/" +
                    this.props.set +
                    "/" +
                    this.props.character.name.replace(/ /g, "") +
                    ".png"
              }
              alt={this.props.character.name}
            ></img>
          </div>
        </Tooltip>
      </div>
    ) : (
      <div
        className={
          "characters-item c" +
          this.props.character.cost +
          (this.props.level ? " l" + this.props.level : "") +
          (this.props.tierlist
            ? (this.props.character.tier_up ? " up" : "") +
              (this.props.character.tier_down ? " down" : "")
            : "") +
          (this.props.champions
            ? (this.props.character.soon ? " soon" : "") +
              (this.props.character.new ? " new" : "") +
              (this.props.character.updated ? " updated" : "") +
              (this.props.character.buff ? " buff" : "") +
              (this.props.character.nerf ? " nerf" : "")
            : "")
        }
        cost={this.props.character.cost}
        name={this.props.character.name}
        sidebar={this.props.sidebar ? this.props.sidebar : null}
        onClick={this.props.selectChampion}
        key={this.props.character.name}
      >
        <Tooltip
          placement="top"
          mouseEnterDelay={0.3}
          mouseLeaveDelay={0.3}
          overlay={
            <div className="character-overlay">
              <div className="character-top">
                <div className="overlay-title">
                  <img
                    className="overlay-icon"
                    src={
                      this.props.character.set.includes(1)
                        ? "https://rerollcdn.com/characters/" +
                          this.props.character.name.replace(/ /g, "") +
                          ".png"
                        : "https://rerollcdn.com/characters/" +
                          this.props.set +
                          "/" +
                          this.props.character.name.replace(/ /g, "") +
                          ".png"
                    }
                    alt={this.props.character.name}
                  ></img>
                  {this.props.lang === "en"
                    ? this.props.character.name
                    : this.props.character.name_ch}
                </div>
                <div className="overlay-bonus-list">
                  {Object.keys(this.props.character.origin).map(function(key) {
                    var origin = this.props.character.origin[key];
                    var origin_ch = this.props.character.origin_ch[key];
                    return (
                      <div className="overlay-bonus-item" key={key}>
                        <img
                          className="overlay-bonus-item-icon"
                          src={
                            "https://rerollcdn.com/icons/" +
                            origin.replace(/ /g, "").toLowerCase() +
                            ".png"
                          }
                          alt={origin}
                        ></img>
                        <div className="overlay-bonus-item-value">
                          {this.props.lang === "en" ? origin : origin_ch}
                        </div>
                      </div>
                    );
                  }, this)}
                  {Object.keys(this.props.character.type).map(function(key) {
                    var type = this.props.character.type[key];
                    var type_ch = this.props.character.type_ch[key];
                    return (
                      <div className="overlay-bonus-item" key={key}>
                        <img
                          className="overlay-bonus-item-icon"
                          src={
                            "https://rerollcdn.com/icons/" +
                            type.replace(/ /g, "").toLowerCase() +
                            ".png"
                          }
                          alt={type}
                        ></img>
                        <div className="overlay-bonus-item-value">
                          {this.props.lang === "en" ? type : type_ch}
                        </div>
                      </div>
                    );
                  }, this)}
                </div>
                <div className="overlay-cost">
                  <img
                    className="gold-icon"
                    src={require("../images/ui/icon-gold.svg")}
                    alt="cost"
                  ></img>
                  {this.props.character.cost}
                </div>
              </div>
              <div className="overlay-recipe">
                {this.props.lang === "en" ? "Items:" : "装备"}
                {Object.keys(this.props.character.items).map(function(key) {
                  var itemC = this.props.character.items[key];
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
              {Object.keys(this.props.patchJSON).map(function(key, index) {
                var patchNote = this.props.patchJSON[key];
                if (key === this.props.character.name) {
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
          key={origin.name}
        >
          <div className="character-wrapper">
            <img
              className={
                "character-icon" +
                (this.props.activeChampion === this.props.character.name
                  ? " selected"
                  : "")
              }
              src={
                this.props.character.set.includes(1)
                  ? "https://rerollcdn.com/characters/" +
                    this.props.character.name.replace(/ /g, "") +
                    ".png"
                  : "https://rerollcdn.com/characters/" +
                    this.props.set +
                    "/" +
                    this.props.character.name.replace(/ /g, "") +
                    ".png"
              }
              alt={this.props.character.name}
            ></img>
          </div>
        </Tooltip>
        {this.props.team || this.props.history ? (
          this.props.items && this.props.itemsJSON ? (
            <div className="character-items">
              {Object.keys(this.props.items).map(function(key) {
                var characterItem = this.props.items[key];
                return Object.keys(this.props.itemsJSON).map(function(key) {
                  var item = this.props.itemsJSON[key];
                  if (item.set.includes(parseInt(this.props.set))) {
                    if (this.props.board || this.props.history) {
                      return item.name
                        .replace(/ /g, "")
                        .replace(/\./g, "")
                        .replace(/'/g, "")
                        .toLowerCase() === characterItem.toLowerCase() ? (
                        <ItemPortrait
                          item={item}
                          key={key}
                          patchJSON={this.props.patchJSON}
                          lang={this.props.lang}
                        ></ItemPortrait>
                      ) : null;
                    } else {
                      return item.name === characterItem ? (
                        <ItemPortrait
                          item={item}
                          key={key}
                          patchJSON={this.props.patchJSON}
                          lang={this.props.lang}
                        ></ItemPortrait>
                      ) : null;
                    }
                  }
                  return null;
                }, this);
              }, this)}
            </div>
          ) : null
        ) : null}
        {this.props.champions ? (
          <p className="character-name">
            {this.props.lang === "en"
              ? this.props.character.name
              : this.props.character.name_ch}
          </p>
        ) : this.props.table ? (
          this.props.lang === "en" ? (
            this.props.character.name
          ) : (
            this.props.character.name_ch
          )
        ) : null}
      </div>
    );
  }
}
