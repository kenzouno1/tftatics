/*global overwolf*/
import React, { Component } from "react";
// Utilities
import "react-table/react-table.css";
// Components
import { SearchBar } from "./SearchBar";
import { CharacterPortrait } from "../components/CharacterPortrait";
import { TypePortrait } from "../components/TypePortrait";
import { OriginPortrait } from "../components/OriginPortrait";

export class TeamBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      activeCategory: "all",
      teamArr: [],
      bonusArr: [],
      data: {
        Demon: 0,
        Dragon: 0,
        Exile: 0,
        Glacial: 0,
        Hextech: 0,
        Imperial: 0,
        Noble: 0,
        Ninja: 0,
        Pirate: 0,
        Phantom: 0,
        Robot: 0,
        Void: 0,
        Wild: 0,
        Yordle: 0,
        Assassin: 0,
        Blademaster: 0,
        Brawler: 0,
        Elementalist: 0,
        Guardian: 0,
        Gunslinger: 0,
        Knight: 0,
        Ranger: 0,
        Shapeshifter: 0,
        Sorcerer: 0,
        Warden: 0,
        Forest: 0,
        Electric: 0,
        Ocean: 0,
        Inferno: 0,
        Alchemist: 0,
        Mage: 0,
        Summoner: 0,
        Poison: 0,
        Steel: 0,
        Desert: 0,
        Shadow: 0,
        Predator: 0,
        Crystal: 0,
        Mystic: 0,
        Mountain: 0,
        Light: 0,
        Wind: 0,
        Berserker: 0,
        Druid: 0,
        Avatar: 0,
        Cloud: 0,
        Woodland: 0
      }
    };
    this.updateSearch = this.updateSearch.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.addUnit = this.addUnit.bind(this);
    this.removeUnit = this.removeUnit.bind(this);
    this.clearTeam = this.clearTeam.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.sendCustomTeam = this.sendCustomTeam.bind(this);
  }
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
  setCategory(e) {
    this.setState({
      activeCategory: e.currentTarget.attributes.category.value
    });
  }
  addUnit(e) {
    var newTeamArr = this.state.teamArr;
    if (
      !newTeamArr.includes(e.currentTarget.attributes.id.value) &&
      newTeamArr.length < 9
    ) {
      newTeamArr.push(e.currentTarget.attributes.id.value);
      localStorage.setItem("teambuilder", JSON.stringify(newTeamArr));
      console.log(localStorage.getItem("teambuilder"));
      let message = localStorage.getItem("teambuilder");
      overwolf.windows.sendMessage("tracker", "customteam", message, function(
        response
      ) {
        if (response.status === "error") {
          console.log("tracker message failed!");
        } else if (response.status === "success") {
          console.log("tracker message sent!");
        }
      });
    }
    this.setState({
      teamArr: newTeamArr,
      copied: false
    });
  }
  removeUnit(e) {
    var newArr = this.state.teamArr;
    for (var i = newArr.length - 1; i >= 0; i--) {
      if (newArr[i] === e.currentTarget.attributes.id.value) {
        newArr.splice(i, 1);
        localStorage.setItem("teambuilder", JSON.stringify(newArr));
        console.log(localStorage.getItem("teambuilder"));
        let message = localStorage.getItem("teambuilder");
        overwolf.windows.sendMessage("tracker", "customteam", message, function(
          response
        ) {
          if (response.status === "error") {
            console.log("tracker message failed!");
          } else if (response.status === "success") {
            console.log("tracker message sent!");
          }
        });
      }
    }
    this.setState({
      teamArr: newArr,
      copied: false
    });
  }
  clearTeam() {
    this.setState({
      teamArr: [],
      bonusArr: [],
      data: {
        Demon: 0,
        Dragon: 0,
        Exile: 0,
        Glacial: 0,
        Hextech: 0,
        Imperial: 0,
        Noble: 0,
        Ninja: 0,
        Pirate: 0,
        Phantom: 0,
        Robot: 0,
        Void: 0,
        Wild: 0,
        Yordle: 0,
        Assassin: 0,
        Blademaster: 0,
        Brawler: 0,
        Elementalist: 0,
        Guardian: 0,
        Gunslinger: 0,
        Knight: 0,
        Ranger: 0,
        Shapeshifter: 0,
        Sorcerer: 0,
        Warden: 0,
        Forest: 0,
        Electric: 0,
        Ocean: 0,
        Inferno: 0,
        Alchemist: 0,
        Mage: 0,
        Summoner: 0,
        Poison: 0,
        Steel: 0,
        Desert: 0,
        Shadow: 0,
        Predator: 0,
        Crystal: 0,
        Mystic: 0,
        Mountain: 0,
        Light: 0,
        Wind: 0,
        Berserker: 0,
        Druid: 0,
        Avatar: 0,
        Cloud: 0,
        Woodland: 0
      }
    });
    localStorage.setItem("teambuilder", JSON.stringify([]));
    console.log(localStorage.getItem("teambuilder"));
    let message = localStorage.getItem("teambuilder");
    overwolf.windows.sendMessage("tracker", "customteam", message, function(
      response
    ) {
      if (response.status === "error") {
        console.log("tracker message failed!");
      } else if (response.status === "success") {
        console.log("tracker message sent!");
      }
    });
  }

  componentDidMount() {
    var teamOnLoad = JSON.parse(localStorage.getItem("teambuilder"));
    if (teamOnLoad) {
      this.setState({
        teamArr: teamOnLoad
      });
      console.log(
        "team saved found: ",
        JSON.parse(localStorage.getItem("teambuilder"))
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    var tableData = {
      Demon: 0,
      Dragon: 0,
      Exile: 0,
      Glacial: 0,
      Hextech: 0,
      Imperial: 0,
      Noble: 0,
      Ninja: 0,
      Pirate: 0,
      Phantom: 0,
      Robot: 0,
      Void: 0,
      Wild: 0,
      Yordle: 0,
      Assassin: 0,
      Blademaster: 0,
      Brawler: 0,
      Elementalist: 0,
      Guardian: 0,
      Gunslinger: 0,
      Knight: 0,
      Ranger: 0,
      Shapeshifter: 0,
      Sorcerer: 0,
      Warden: 0,
      Forest: 0,
      Electric: 0,
      Ocean: 0,
      Inferno: 0,
      Alchemist: 0,
      Mage: 0,
      Summoner: 0,
      Poison: 0,
      Steel: 0,
      Desert: 0,
      Shadow: 0,
      Predator: 0,
      Crystal: 0,
      Mystic: 0,
      Mountain: 0,
      Light: 0,
      Wind: 0,
      Berserker: 0,
      Druid: 0,
      Avatar: 0,
      Cloud: 0,
      Woodland: 0
    };
    Object.keys(this.state.teamArr).map(function(key) {
      var id = this.state.teamArr[key];
      Object.keys(this.props.charactersJSON).map(function(key) {
        var character = this.props.charactersJSON[key];
        if (character.id === id) {
          Object.keys(character.origin).map(function(key) {
            var origin = character.origin[key];
            switch (origin) {
              case "Demon":
                tableData.Demon += 1;
                break;
              case "Dragon":
                tableData.Dragon += 1;
                break;
              case "Exile":
                tableData.Exile += 1;
                break;
              case "Glacial":
                character.name.includes("Lux")
                  ? (tableData.Glacial += 2)
                  : (tableData.Glacial += 1);
                break;
              case "Hextech":
                tableData.Hextech += 1;
                break;
              case "Imperial":
                tableData.Imperial += 1;
                break;
              case "Noble":
                tableData.Noble += 1;
                break;
              case "Ninja":
                tableData.Ninja += 1;
                break;
              case "Pirate":
                tableData.Pirate += 1;
                break;
              case "Phantom":
                tableData.Phantom += 1;
                break;
              case "Robot":
                tableData.Robot += 1;
                break;
              case "Void":
                tableData.Void += 1;
                break;
              case "Wild":
                tableData.Wild += 1;
                break;
              case "Yordle":
                tableData.Yordle += 1;
                break;
              case "Ocean":
                character.name.includes("Lux")
                  ? (tableData.Ocean += 2)
                  : (tableData.Ocean += 1);
                break;
              case "Shadow":
                character.name.includes("Lux")
                  ? (tableData.Shadow += 2)
                  : (tableData.Shadow += 1);
                break;
              case "Inferno":
                character.name.includes("Lux")
                  ? (tableData.Inferno += 2)
                  : (tableData.Inferno += 1);
                break;
              case "Woodland":
                character.name.includes("Lux")
                  ? (tableData.Woodland += 2)
                  : (tableData.Woodland += 1);
                break;
              case "Desert":
                tableData.Desert += 1;
                break;
              case "Poison":
                tableData.Poison += 1;
                break;
              case "Steel":
                character.name.includes("Lux")
                  ? (tableData.Steel += 2)
                  : (tableData.Steel += 1);
                break;
              case "Electric":
                character.name.includes("Lux")
                  ? (tableData.Electric += 2)
                  : (tableData.Electric += 1);
                break;
              case "Crystal":
                character.name.includes("Lux")
                  ? (tableData.Crystal += 2)
                  : (tableData.Crystal += 1);
                break;
              case "Cloud":
                character.name.includes("Lux")
                  ? (tableData.Cloud += 2)
                  : (tableData.Cloud += 1);
                break;
              case "Light":
                character.name.includes("Lux")
                  ? (tableData.Light += 2)
                  : (tableData.Light += 1);
                break;
              case "Mountain":
                tableData.Mountain += 1;
                break;
              default:
                return null;
            }
            return null;
          }, this);
          Object.keys(character.type).map(function(key) {
            var type = character.type[key];
            switch (type) {
              case "Assassin":
                tableData.Assassin += 1;
                break;
              case "Blademaster":
                tableData.Blademaster += 1;
                break;
              case "Brawler":
                tableData.Brawler += 1;
                break;
              case "Elementalist":
                tableData.Elementalist += 1;
                break;
              case "Guardian":
                tableData.Guardian += 1;
                break;
              case "Gunslinger":
                tableData.Gunslinger += 1;
                break;
              case "Knight":
                tableData.Knight += 1;
                break;
              case "Ranger":
                tableData.Ranger += 1;
                break;
              case "Shapeshifter":
                tableData.Shapeshifter += 1;
                break;
              case "Sorcerer":
                tableData.Sorcerer += 1;
                break;
              case "Mage":
                tableData.Mage += 1;
                break;
              case "Summoner":
                tableData.Summoner += 1;
                break;
              case "Alchemist":
                tableData.Alchemist += 1;
                break;
              case "Predator":
                tableData.Predator += 1;
                break;
              case "Warden":
                tableData.Warden += 1;
                break;
              case "Mystic":
                tableData.Mystic += 1;
                break;
              case "Druid":
                tableData.Druid += 1;
                break;
              case "Avatar":
                tableData.Avatar += 1;
                break;
              case "Berserker":
                tableData.Berserker += 1;
                break;
              default:
                return null;
            }
            return null;
          }, this);
        }
        return null;
      }, this);
      return null;
    }, this);

    if (prevState.data === this.state.data) {
      this.setState({
        data: tableData
      });
    } else {
      return null;
    }
  }

  sendCustomTeam() {
    var message = localStorage.getItem("teambuilder");
    overwolf.windows.sendMessage("tracker", "customteam", message, function(
      response
    ) {
      if (response.status === "error") {
        console.log("customteam tracker message failed!");
      } else if (response.status === "success") {
        console.log("customteam tracker message sent!");
      }
    });
  }

  render() {
    return (
      <main className="builder">
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
                          builder={true}
                          key={key}
                          addUnit={this.addUnit}
                          removeUnit={this.removeUnit}
                          teamArr={this.state.teamArr}
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
          <div className="header-wrapper">
            <h1>
              {this.props.lang === "en" ? "Team Builder" : "阵容模拟"} - (
              {this.state.teamArr.length} / 9)
            </h1>
            <div className="btns">
              <img
                className={
                  "team-pin" +
                  (this.state.teamArr.length > 0 ? " selected" : "")
                }
                src={require("../images/ui/icon-pin.svg")}
                alt="team pin"
                onClick={this.sendCustomTeam}
              ></img>
              <div className="btn" onClick={this.clearTeam}>
                {this.props.lang === "en" ? "Clear Team" : "清除阵容"}
              </div>
            </div>
          </div>
          <div className="characters-list team">
            {this.state.teamArr.length > 0 ? (
              Object.keys(this.state.teamArr).map(function(key) {
                var id = this.state.teamArr[key];
                return Object.keys(this.props.charactersJSON).map(function(
                  key
                ) {
                  var character = this.props.charactersJSON[key];
                  if (character.id === id) {
                    return (
                      <div
                        className="characters-item"
                        key={character.name}
                        id={character.id}
                        onClick={this.removeUnit}
                      >
                        <div className={"character-wrapper c" + character.cost}>
                          <img
                            className="character-icon"
                            src={
                              character.set.includes(1)
                                ? "https://rerollcdn.com/characters/" +
                                  character.name.replace(/ /g, "") +
                                  ".png"
                                : "https://rerollcdn.com/characters/2/" +
                                  character.name.replace(/ /g, "") +
                                  ".png"
                            }
                            alt={character.name}
                          ></img>
                          <div className="character-synergies">
                            {Object.keys(character.origin).map(function(key) {
                              var origin = character.origin[key];
                              return (
                                <img
                                  className="character-origin"
                                  src={
                                    "https://rerollcdn.com/icons/" +
                                    origin.replace(/ /g, "").toLowerCase() +
                                    ".png"
                                  }
                                  alt={origin}
                                  key={key}
                                ></img>
                              );
                            }, this)}
                            {Object.keys(character.type).map(function(key) {
                              var type = character.type[key];
                              return (
                                <img
                                  className="character-type"
                                  src={
                                    "https://rerollcdn.com/icons/" +
                                    type.replace(/ /g, "").toLowerCase() +
                                    ".png"
                                  }
                                  alt={type}
                                  key={key}
                                ></img>
                              );
                            }, this)}
                          </div>
                        </div>
                        <p className="character-name">
                          {this.props.lang === "en"
                            ? character.name
                            : character.name_ch}
                        </p>
                      </div>
                    );
                  }
                  return null;
                },
                this);
              }, this)
            ) : (
              <div className="builder-cta">
                {this.props.lang === "en"
                  ? "Your team is empty!"
                  : "你的阵容是空的"}
              </div>
            )}
          </div>
          <div className="builder-bonus">
            <div className="builder-bonus-group">
              <h3>{this.props.lang === "en" ? "Origins" : "种族"}</h3>
              <div className="builder-bonus-list">
                {Object.keys(this.props.originsJSON).map(function(key) {
                  var origin = this.props.originsJSON[key];
                  if (origin.set.includes(parseInt(this.props.set))) {
                    return (
                      <OriginPortrait
                        origin={origin}
                        builder={true}
                        data={this.state.data}
                        key={key}
                        charactersJSON={this.props.charactersJSON}
                        originsJSON={this.props.originsJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></OriginPortrait>
                    );
                  }
                  return null;
                }, this)}
              </div>
            </div>
            <div className="builder-bonus-group">
              <h3>{this.props.lang === "en" ? "Classes" : "职业"}</h3>
              <div className="builder-bonus-list">
                {Object.keys(this.props.typesJSON).map(function(key) {
                  var type = this.props.typesJSON[key];
                  if (type.set.includes(parseInt(this.props.set))) {
                    return (
                      <TypePortrait
                        type={type}
                        builder={true}
                        data={this.state.data}
                        key={key}
                        charactersJSON={this.props.charactersJSON}
                        typesJSON={this.props.typesJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></TypePortrait>
                    );
                  }
                  return null;
                }, this)}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
