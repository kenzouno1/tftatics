import React, { Component } from "react";
// TFT
// Components
import { SearchBar } from "../components/SearchBar";
import { CharacterPortrait } from "../components/CharacterPortrait";
import { ItemPortrait } from "../components/ItemPortrait";
import { Divider } from "../components/Divider";

export class Champions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      activeChampion: "Aatrox",
      activeCategory: "all"
    };
    this.updateSearch = this.updateSearch.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.selectChampion = this.selectChampion.bind(this);
    this.setCategory = this.setCategory.bind(this);
  }

  // TFT
  updateSearch(event) {
    this.setState({
      searchValue: event.target.value
    });
  }
  clearSearch() {
    this.setState({
      searchValue: ""
    });
  }
  selectChampion(e) {
    this.setState({
      activeChampion: e.currentTarget.attributes.name.value,
      activeCategory:
        e.currentTarget.attributes.sidebar.value === "sidebar"
          ? this.state.activeCategory
          : "all"
    });
  }
  setCategory(e) {
    this.setState({
      activeCategory: e.currentTarget.attributes.category.value
    });
  }

  render() {
    var data = this.props.charactersJSON;
    data.sort(function(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    return (
      <main className="champions">
        <div className="sidebar">
          <div className="sidebar-navigation">
            <div
              className={
                "characters-category" +
                (this.state.activeCategory === "all" ? " active" : "")
              }
              category={"all"}
              onClick={this.setCategory}
            >
              <h3>{this.props.lang === "en" ? "All" : "所有英雄"}</h3>
            </div>
            <div
              className={
                "characters-category" +
                (this.state.activeCategory === "1" ? " active" : "")
              }
              category={"1"}
              onClick={this.setCategory}
            >
              <img
                src={require("../images/ui/icon-gold.svg")}
                alt="gold cost"
              ></img>{" "}
              <h3>1</h3>
            </div>
            <div
              className={
                "characters-category" +
                (this.state.activeCategory === "2" ? " active" : "")
              }
              category={"2"}
              onClick={this.setCategory}
            >
              <img
                src={require("../images/ui/icon-gold.svg")}
                alt="gold cost"
              ></img>{" "}
              <h3>2</h3>
            </div>
            <div
              className={
                "characters-category" +
                (this.state.activeCategory === "3" ? " active" : "")
              }
              category={"3"}
              onClick={this.setCategory}
            >
              <img
                src={require("../images/ui/icon-gold.svg")}
                alt="gold cost"
              ></img>{" "}
              <h3>3</h3>
            </div>
            <div
              className={
                "characters-category" +
                (this.state.activeCategory === "4" ? " active" : "")
              }
              category={"4"}
              onClick={this.setCategory}
            >
              <img
                src={require("../images/ui/icon-gold.svg")}
                alt="gold cost"
              ></img>{" "}
              <h3>4</h3>
            </div>
            <div
              className={
                "characters-category" +
                (this.state.activeCategory === "5" ? " active" : "")
              }
              category={"5"}
              onClick={this.setCategory}
            >
              <img
                src={require("../images/ui/icon-gold.svg")}
                alt="gold cost"
              ></img>{" "}
              <h3>5</h3>
            </div>
          </div>
          <div className="searchbar-wrapper">
            <SearchBar
              searchValue={this.state.searchValue}
              placeholderValue={
                this.props.lang === "en"
                  ? "Search by name, origin, or class..."
                  : "搜索"
              }
              updateSearch={this.updateSearch}
              clearSearch={this.clearSearch}
            />
          </div>
          <div className="characters-list">
            {Object.keys(this.props.charactersJSON).map(function(key) {
              var character = this.props.charactersJSON[key];
              if (character.active) {
                if (character.set.includes(parseInt(this.props.set))) {
                  if (
                    character.cost + "" === this.state.activeCategory ||
                    this.state.activeCategory === "all"
                  ) {
                    if (
                      this.state.searchValue === "" ||
                      character.name
                        .toLowerCase()
                        .includes(this.state.searchValue.toLowerCase()) ||
                      character.type[0]
                        .toLowerCase()
                        .includes(this.state.searchValue.toLowerCase()) ||
                      character.origin[0]
                        .toLowerCase()
                        .includes(this.state.searchValue.toLowerCase()) ||
                      (character.origin[1] &&
                        character.origin[1]
                          .toLowerCase()
                          .includes(this.state.searchValue.toLowerCase())) ||
                      (character.type[1] &&
                        character.type[1]
                          .toLowerCase()
                          .includes(this.state.searchValue.toLowerCase()))
                    ) {
                      return (
                        <CharacterPortrait
                          character={character}
                          key={key}
                          selectChampion={this.selectChampion}
                          activeChampion={this.state.activeChampion}
                          sidebar={"sidebar"}
                          patchJSON={this.props.patchJSON}
                          lang={this.props.lang}
                          set={this.props.set}
                        ></CharacterPortrait>
                      );
                    }
                  }
                }
              }
              return null;
            }, this)}
          </div>
        </div>

        <div className="main main-wrapper">
          {Object.keys(this.props.charactersJSON).map(function(key) {
            var characterData = this.props.charactersJSON[key];
            if (characterData.active) {
              if (characterData.set.includes(parseInt(this.props.set))) {
                if (characterData.name === this.state.activeChampion) {
                  return (
                    <div className="character">
                      <div className="character-banner">
                        <div className="character-portrait">
                          <div className="character-wrapper">
                            <img
                              className="character-image"
                              src={
                                characterData.set.includes(1)
                                  ? "https://rerollcdn.com/characters/" +
                                    characterData.name.replace(/ /g, "") +
                                    ".png"
                                  : "https://rerollcdn.com/characters/" +
                                    this.props.set +
                                    "/" +
                                    characterData.name.replace(/ /g, "") +
                                    ".png"
                              }
                              alt={characterData.name}
                            ></img>
                          </div>
                          <div className="character-meta">
                            <h1>
                              {this.props.lang === "en"
                                ? characterData.name
                                : characterData.name_ch}
                            </h1>
                            <div>
                              <span className="bold">
                                {this.props.lang === "en"
                                  ? "Range:"
                                  : "攻击范围"}{" "}
                              </span>
                              {characterData.range_sm} •{" "}
                              <span className="bold">
                                {this.props.lang === "en" ? "Cost:" : "费用"}{" "}
                              </span>
                              {characterData.cost}
                            </div>
                          </div>
                        </div>
                        <div className="character-items">
                          <div className="items-list">
                            {Object.keys(characterData.items).map(function(
                              key
                            ) {
                              var characterItem = characterData.items[key];
                              return Object.keys(this.props.itemsJSON).map(
                                function(key) {
                                  var item = this.props.itemsJSON[key];
                                  if (
                                    item.set.includes(parseInt(this.props.set))
                                  ) {
                                    return item.name === characterItem ? (
                                      <ItemPortrait
                                        item={item}
                                        key={key}
                                        patchJSON={this.props.patchJSON}
                                        lang={this.props.lang}
                                      ></ItemPortrait>
                                    ) : null;
                                  }
                                  return null;
                                },
                                this
                              );
                            },
                            this)}
                          </div>
                        </div>
                      </div>
                      <div className="character-stats">
                        <ul className="stats-list">
                          <li>
                            <img
                              src={require("../images/ui/icon-hp.svg")}
                              alt="hp"
                            ></img>
                            {characterData.health[0]}
                          </li>
                          <li>
                            <img
                              src={require("../images/ui/icon-ar.svg")}
                              alt="hp"
                            ></img>
                            {characterData.armor}
                          </li>
                          <li>
                            <img
                              src={require("../images/ui/icon-mr.svg")}
                              alt="hp"
                            ></img>
                            {characterData.resistance[0]}
                          </li>
                          <li>
                            <img
                              src={require("../images/ui/icon-ad.svg")}
                              alt="hp"
                            ></img>
                            {characterData.attack[0]}
                          </li>
                          <li>
                            <img
                              src={require("../images/ui/icon-as.svg")}
                              alt="hp"
                            ></img>
                            {characterData.speed}
                          </li>
                        </ul>
                      </div>

                      <div className="character-skill">
                        <div className="character-ability">
                          <img
                            className="ability-image"
                            src={
                              characterData.set.includes(1)
                                ? "https://rerollcdn.com/abilities/" +
                                  characterData.name
                                    .replace(/ /g, "-")
                                    .toLowerCase() +
                                  "-" +
                                  characterData.skill[0].name
                                    .toLowerCase()
                                    .replace(/ /g, "-")
                                    .replace(/'/g, "")
                                    .replace(/!/g, "") +
                                  ".png"
                                : "https://rerollcdn.com/abilities/" +
                                  this.props.set +
                                  "/" +
                                  characterData.name
                                    .replace(/ /g, "-")
                                    .toLowerCase() +
                                  "-" +
                                  characterData.skill[0].name
                                    .toLowerCase()
                                    .replace(/ /g, "-")
                                    .replace(/'/g, "")
                                    .replace(/!/g, "") +
                                  ".png"
                            }
                            alt={characterData.skill[0].name}
                          ></img>
                          <div className="ability-description">
                            <div className="ability-description-header">
                              <div className="ability-description-name">
                                <h3>
                                  {this.props.lang === "en"
                                    ? characterData.skill[0].name
                                    : characterData.skill[0].name_ch}
                                </h3>
                                <h4>{characterData.skill[0].type}</h4>
                              </div>
                              {characterData.mana_cost !== 0 ? (
                                <div className="ability-description-cost">
                                  <img
                                    src={require("../images/ui/icon-mana.svg")}
                                    alt="mana cost"
                                  ></img>{" "}
                                  <span>
                                    <b>
                                      {characterData.mana_start
                                        ? characterData.mana_start
                                        : "0"}
                                    </b>{" "}
                                    / {characterData.mana_cost}
                                  </span>
                                </div>
                              ) : null}
                            </div>
                            <div className="ability-bonus">
                              <p>
                                {this.props.lang === "en"
                                  ? characterData.skill[0].description
                                  : characterData.skill[0].description_ch}
                              </p>
                            </div>
                            <ul className="ability-list">
                              {Object.keys(characterData.skill[0].tags).map(
                                function(key) {
                                  var tag = characterData.skill[0].tags[key];
                                  return (
                                    <li key={tag.name}>
                                      <span className="bold">{tag.name}: </span>
                                      {tag.bonus.join(" / ")}
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="character-synergy">
                        <Divider></Divider>
                        {Object.keys(characterData.origin).map(function(key) {
                          var origin = characterData.origin[key];
                          return (
                            <div className="synergy-list" key={key}>
                              <img
                                className="misc-image"
                                src={
                                  "https://rerollcdn.com/icons/" +
                                  origin.replace(/ /g, "_").toLowerCase() +
                                  ".png"
                                }
                                alt={origin}
                              ></img>
                              <div className="characters-list">
                                {Object.keys(this.props.charactersJSON).map(
                                  function(key) {
                                    var character = this.props.charactersJSON[
                                      key
                                    ];
                                    if (character.active) {
                                      if (
                                        character.set.includes(
                                          parseInt(this.props.set)
                                        )
                                      ) {
                                        if (
                                          character.name !== characterData.name
                                        ) {
                                          if (
                                            character.origin.includes(origin)
                                          ) {
                                            return (
                                              <CharacterPortrait
                                                character={character}
                                                key={key}
                                                sidebar={"main"}
                                                selectChampion={
                                                  this.selectChampion
                                                }
                                                patchJSON={this.props.patchJSON}
                                                lang={this.props.lang}
                                                set={this.props.set}
                                              ></CharacterPortrait>
                                            );
                                          }
                                        }
                                      }
                                    }
                                    return null;
                                  },
                                  this
                                )}
                              </div>
                            </div>
                          );
                        }, this)}
                        {Object.keys(characterData.type).map(function(key) {
                          var type = characterData.type[key];
                          return (
                            <div className="synergy-list" key={key}>
                              <img
                                className="misc-image"
                                src={
                                  "https://rerollcdn.com/icons/" +
                                  type.replace(/ /g, "_").toLowerCase() +
                                  ".png"
                                }
                                alt={type}
                              ></img>
                              <div className="characters-list">
                                {Object.keys(this.props.charactersJSON).map(
                                  function(key) {
                                    var character = this.props.charactersJSON[
                                      key
                                    ];
                                    if (character.active) {
                                      if (
                                        character.set.includes(
                                          parseInt(this.props.set)
                                        )
                                      ) {
                                        if (
                                          character.name !== characterData.name
                                        ) {
                                          if (character.type.includes(type)) {
                                            return (
                                              <CharacterPortrait
                                                character={character}
                                                key={key}
                                                sidebar={"main"}
                                                selectChampion={
                                                  this.selectChampion
                                                }
                                                patchJSON={this.props.patchJSON}
                                                lang={this.props.lang}
                                                set={this.props.set}
                                              ></CharacterPortrait>
                                            );
                                          }
                                        }
                                      }
                                    }
                                    return null;
                                  },
                                  this
                                )}
                              </div>
                            </div>
                          );
                        }, this)}
                      </div>
                    </div>
                  );
                }
              }
            }
            return null;
          }, this)}
        </div>
      </main>
    );
  }
}
