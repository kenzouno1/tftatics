import React, { Component } from "react";
// TFT
// Components
import { SearchBar } from "../components/SearchBar";
import TeamPortrait from "../components/TeamPortrait";
import TypePortrait from "./TypePortrait.js";
import OriginPortrait from "./OriginPortrait.js";
import CharacterPortrait from "./CharacterPortrait.js";
import { withTranslation } from "react-i18next";
class Traits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      activeTrait: "",
      activeCategory: "champions",
      activeTeam: "",
      adActive: false
    };
    this.updateSearch = this.updateSearch.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.selectTrait = this.selectTrait.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.selectTeam = this.selectTeam.bind(this);
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
  selectTrait(e) {
    if (e.currentTarget.attributes.name.value !== this.state.activeTrait) {
      this.setState({
        activeTrait: e.currentTarget.attributes.name.value
      });
    } else {
      this.setState({
        activeTrait: ""
      });
    }
  }
  setCategory(e) {
    this.setState({
      activeCategory: e.currentTarget.attributes.category.value
    });
  }

  selectTeam(e) {
    this.setState({
      activeTeam: e.currentTarget.attributes.team.value
    });
  }

  render() {
    const { t } = this.props;
    var data = this.props.metaJSON;
    data.sort(function(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    data.sort(function(a, b) {
      if (a.tier_up > b.tier_up) {
        return -1;
      }
      if (a.tier_up < b.tier_up) {
        return 1;
      }
      return 0;
    });
    data.sort(function(a, b) {
      if (a.tier_down < b.tier_down) {
        return -1;
      }
      if (a.tier_down > b.tier_down) {
        return 1;
      }
      return 0;
    });
    data.sort(function(a, b) {
      if (a.new === true) {
        return -1;
      }
      return 0;
    });

    return (
      <main className="traits">
        <div className="sidebar">
          <div className="sidebar-navigation">
            <div
              className={
                "characters-category" +
                (this.state.activeCategory === "champions" ? " active" : "")
              }
              category={"champions"}
              onClick={this.setCategory}
            >
              <h3>{t("Champions")}</h3>
            </div>
            <div
              className={
                "characters-category" +
                (this.state.activeCategory === "traits" ? " active" : "")
              }
              category={"traits"}
              onClick={this.setCategory}
            >
              <h3>{t("Traits")}</h3>
            </div>
          </div>
          <div className="searchbar-wrapper">
            <SearchBar
              searchValue={this.state.searchValue}
              placeholderValue={t("Search by name...")}
              updateSearch={this.updateSearch}
              clearSearch={this.clearSearch}
            />
          </div>
          <div className={"characters-list " + this.state.activeCategory}>
            {this.state.activeCategory === "traits" ? (
              <React.Fragment>
                {Object.keys(this.props.originsJSON).map(function(key) {
                  var origin = this.props.originsJSON[key];
                  if (origin.set.includes(parseInt(this.props.set))) {
                    if (
                      this.state.searchValue === "" ||
                      origin.name
                        .toLowerCase()
                        .includes(this.state.searchValue.toLowerCase())
                    ) {
                      return (
                        <OriginPortrait
                          origin={origin}
                          selectTrait={this.selectTrait}
                          activeTrait={this.state.activeTrait}
                          table={true}
                          charactersJSON={this.props.charactersJSON}
                          patchJSON={this.props.patchJSON}
                          lang={this.props.lang}
                          set={this.props.set}
                        ></OriginPortrait>
                      );
                    }
                  }
                  return null;
                }, this)}
                {Object.keys(this.props.typesJSON).map(function(key) {
                  var type = this.props.typesJSON[key];
                  if (type.set.includes(parseInt(this.props.set))) {
                    if (
                      this.state.searchValue === "" ||
                      type.name
                        .toLowerCase()
                        .includes(this.state.searchValue.toLowerCase())
                    ) {
                      return (
                        <TypePortrait
                          type={type}
                          selectTrait={this.selectTrait}
                          activeTrait={this.state.activeTrait}
                          table={true}
                          charactersJSON={this.props.charactersJSON}
                          patchJSON={this.props.patchJSON}
                          lang={this.props.lang}
                          set={this.props.set}
                        ></TypePortrait>
                      );
                    }
                  }
                  return null;
                }, this)}
              </React.Fragment>
            ) : null}
            {this.state.activeCategory === "champions"
              ? Object.keys(this.props.charactersJSON).map(function(key) {
                  var character = this.props.charactersJSON[key];
                  if (character.active) {
                    if (character.set.includes(parseInt(this.props.set))) {
                      if (
                        this.state.searchValue === "" ||
                        character.name
                          .toLowerCase()
                          .includes(this.state.searchValue.toLowerCase())
                      ) {
                        return (
                          <CharacterPortrait
                            character={character}
                            key={key}
                            selectChampion={this.selectTrait}
                            activeChampion={this.state.activeTrait}
                            sidebar={"sidebar"}
                            patchJSON={this.props.patchJSON}
                            lang={this.props.lang}
                            set={this.props.set}
                          ></CharacterPortrait>
                        );
                      }
                    }
                  }
                  return null;
                }, this)
              : null}
          </div>
        </div>

        <div className="main main-wrapper">
          <div className="header-wrapper">
            <h1>{t("Popular Team Comps")}</h1>
            <div className="legend">
              <div className="legend-item">
                <div className="legend-up">▴</div>
                {t("Tier Up")}
              </div>
              <div className="legend-item">
                <div className="legend-down">▾</div>
                {t("Tier Down")}
              </div>
              <div className="legend-item">
                <div className="legend-new">N</div>
                {t("New")}
              </div>
            </div>
          </div>
          {Object.keys(data).map(function(key) {
            var team = data[key];
            var teamCharacters = [];
            Object.keys(team.characters).map(function(key) {
              var teamCharacter = team.characters[key];
              teamCharacters.push(teamCharacter.name);
              return null;
            });
            if (team.set.includes(parseInt(this.props.set))) {
              if (team.tier === 1) {
                return team.traits.includes(this.state.activeTrait) ||
                  this.state.activeTrait === "" ||
                  teamCharacters.includes(this.state.activeTrait) ? (
                  <TeamPortrait
                    data={team}
                    key={key}
                    activeTeam={this.state.activeTeam}
                    selectTeam={this.selectTeam}
                    originsJSON={this.props.originsJSON}
                    typesJSON={this.props.typesJSON}
                    itemsJSON={this.props.itemsJSON}
                    charactersJSON={this.props.charactersJSON}
                    title={"S"}
                    css={"tone"}
                    patchJSON={this.props.patchJSON}
                    lang={this.props.lang}
                    set={this.props.set}
                  ></TeamPortrait>
                ) : null;
              }
            }
            return null;
          }, this)}
          {Object.keys(data).map(function(key) {
            var team = data[key];
            var teamCharacters = [];
            Object.keys(team.characters).map(function(key) {
              var teamCharacter = team.characters[key];
              teamCharacters.push(teamCharacter.name);
              return null;
            });
            if (team.set.includes(parseInt(this.props.set))) {
              if (team.tier === 2) {
                return team.traits.includes(this.state.activeTrait) ||
                  this.state.activeTrait === "" ||
                  teamCharacters.includes(this.state.activeTrait) ? (
                  <TeamPortrait
                    data={team}
                    key={key}
                    activeTeam={this.state.activeTeam}
                    selectTeam={this.selectTeam}
                    originsJSON={this.props.originsJSON}
                    typesJSON={this.props.typesJSON}
                    itemsJSON={this.props.itemsJSON}
                    charactersJSON={this.props.charactersJSON}
                    title={"A"}
                    css={"ttwo"}
                    patchJSON={this.props.patchJSON}
                    lang={this.props.lang}
                    set={this.props.set}
                  ></TeamPortrait>
                ) : null;
              }
            }
            return null;
          }, this)}
          {Object.keys(data).map(function(key) {
            var team = data[key];
            var teamCharacters = [];
            Object.keys(team.characters).map(function(key) {
              var teamCharacter = team.characters[key];
              teamCharacters.push(teamCharacter.name);
              return null;
            });
            if (team.set.includes(parseInt(this.props.set))) {
              if (team.tier === 3) {
                return team.traits.includes(this.state.activeTrait) ||
                  this.state.activeTrait === "" ||
                  teamCharacters.includes(this.state.activeTrait) ? (
                  <TeamPortrait
                    data={team}
                    key={key}
                    activeTeam={this.state.activeTeam}
                    selectTeam={this.selectTeam}
                    originsJSON={this.props.originsJSON}
                    typesJSON={this.props.typesJSON}
                    itemsJSON={this.props.itemsJSON}
                    charactersJSON={this.props.charactersJSON}
                    title={"B"}
                    css={"tthree"}
                    patchJSON={this.props.patchJSON}
                    lang={this.props.lang}
                    set={this.props.set}
                  ></TeamPortrait>
                ) : null;
              }
            }
            return null;
          }, this)}
          {Object.keys(data).map(function(key) {
            var team = data[key];
            var teamCharacters = [];
            Object.keys(team.characters).map(function(key) {
              var teamCharacter = team.characters[key];
              teamCharacters.push(teamCharacter.name);
              return null;
            });
            if (team.set.includes(parseInt(this.props.set))) {
              if (team.tier === 4) {
                return team.traits.includes(this.state.activeTrait) ||
                  this.state.activeTrait === "" ||
                  teamCharacters.includes(this.state.activeTrait) ? (
                  <TeamPortrait
                    data={team}
                    key={key}
                    activeTeam={this.state.activeTeam}
                    selectTeam={this.selectTeam}
                    originsJSON={this.props.originsJSON}
                    typesJSON={this.props.typesJSON}
                    itemsJSON={this.props.itemsJSON}
                    charactersJSON={this.props.charactersJSON}
                    title={"C"}
                    css={"tfour"}
                    patchJSON={this.props.patchJSON}
                    lang={this.props.lang}
                    set={this.props.set}
                  ></TeamPortrait>
                ) : null;
              }
            }
            return null;
          }, this)}
          {Object.keys(data).map(function(key) {
            var team = data[key];
            var teamCharacters = [];
            Object.keys(team.characters).map(function(key) {
              var teamCharacter = team.characters[key];
              teamCharacters.push(teamCharacter.name);
              return null;
            });
            if (team.set.includes(parseInt(this.props.set))) {
              if (team.tier === 5) {
                return team.traits.includes(this.state.activeTrait) ||
                  this.state.activeTrait === "" ||
                  teamCharacters.includes(this.state.activeTrait) ? (
                  <TeamPortrait
                    data={team}
                    key={key}
                    activeTeam={this.state.activeTeam}
                    selectTeam={this.selectTeam}
                    originsJSON={this.props.originsJSON}
                    typesJSON={this.props.typesJSON}
                    itemsJSON={this.props.itemsJSON}
                    charactersJSON={this.props.charactersJSON}
                    title={"D"}
                    css={"tfive"}
                    patchJSON={this.props.patchJSON}
                    lang={this.props.lang}
                    set={this.props.set}
                  ></TeamPortrait>
                ) : null;
              }
            }
            return null;
          }, this)}
        </div>
      </main>
    );
  }
}
export default withTranslation()(Traits);
