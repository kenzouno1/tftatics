/*global overwolf*/
// Utilities
import React, { Component } from "react";
// Components
import CharacterPortrait from "./CharacterPortrait.js";
import TypePortrait from "./TypePortrait.js";
import OriginPortrait from "./OriginPortrait.js";
import { Hex } from "./Hex.js";
import { withTranslation } from "react-i18next";
class TeamPortrait extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      height: 0
    };
    this.toggleActive = this.toggleActive.bind(this);
    this.sendTeam = this.sendTeam.bind(this);
  }

  toggleActive() {
    if (!this.props.pin) {
      this.setState({
        isActive: this.state.isActive === true ? false : true,
        height: this.state.height === 0 ? "auto" : 0
      });
    }
  }

  sendTeam(e) {
    this.props.selectTeam(e);
    var message = e.currentTarget.attributes.team.value;
    overwolf.windows.sendMessage("tracker", "team", message, function(
      response
    ) {
      if (response.status === "error") {
        console.log("team tracker message failed!");
      } else if (response.status === "success") {
        console.log("team tracker message sent!");
      }
    });
  }

  render() {
    const isActive = this.state.isActive;
    const { t } = this.props;
    return (
      <div className="team-wrapper">
        <div
          className={
            "team-portrait" +
            (this.props.pin ? " open" : isActive ? " open" : "") +
            (this.props.data.tier_down ? " down" : "") +
            (this.props.data.tier_up ? " up" : "") +
            (this.props.data.new ? " new" : "")
          }
        >
          <div className="team-portrait-main">
            {this.props.pin ? null : (
              <div
                className={
                  "team-pin" +
                  (this.props.activeTeam === this.props.data.name
                    ? " selected"
                    : "")
                }
                team={this.props.data.name}
                onClick={this.sendTeam}
              >
                <img
                  src={require("../images/ui/icon-pin.svg")}
                  alt="team pin"
                ></img>
              </div>
            )}
            {this.props.pin ? null : (
              <React.Fragment>
                <div className="team-name">
                  {this.props.title ? (
                    <div className={"team-rank " + this.props.css}>
                      {this.props.title}
                    </div>
                  ) : null}
                  {this.props.lang !== "ch"
                    ? this.props.data.name
                    : this.props.data.name_ch}
                </div>
              </React.Fragment>
            )}
            <div className="team-characters">
              {Object.keys(this.props.data.characters).map(function(key) {
                var teamCharacter = this.props.data.characters[key];
                return Object.keys(this.props.charactersJSON).map(function(
                  key
                ) {
                  var character = this.props.charactersJSON[key];
                  return teamCharacter.name === character.name &&
                    character.set.includes(parseInt(this.props.set)) ? (
                    <CharacterPortrait
                      character={character}
                      key={key}
                      items={teamCharacter.items ? teamCharacter.items : null}
                      team={true}
                      itemsJSON={this.props.itemsJSON}
                      patchJSON={this.props.patchJSON}
                      lang={this.props.lang}
                      set={this.props.set}
                    ></CharacterPortrait>
                  ) : null;
                },
                this);
              }, this)}
            </div>
            {this.props.pin ? null : (
              <div className="team-more" onClick={this.toggleActive}>
                <i className="arrow down"></i>
              </div>
            )}
          </div>
          {this.props.pin ? null : this.state.isActive ? (
            <React.Fragment>
              <div className="team-expanded">
                <div className="team-expanded-group mid">
                  <div className="team-expanded-list">
                    {this.props.data.mid
                      ? Object.keys(this.props.data.mid).map(function(key) {
                          var midCharacter = this.props.data.mid[key];
                          return Object.keys(this.props.charactersJSON).map(
                            function(key) {
                              var character = this.props.charactersJSON[key];
                              return midCharacter === character.name &&
                                character.set.includes(
                                  parseInt(this.props.set)
                                ) ? (
                                <CharacterPortrait
                                  character={character}
                                  key={key}
                                  patchJSON={this.props.patchJSON}
                                  lang={this.props.lang}
                                  set={this.props.set}
                                ></CharacterPortrait>
                              ) : null;
                            },
                            this
                          );
                        }, this)
                      : null}
                  </div>
                  <div className="team-expanded-title">{t("Early Game")}</div>
                </div>
                <div className="team-expanded-group builder">
                  <div className="builder-bonus">
                    <div className="builder-bonus-group">
                      <div className="builder-bonus-list">
                        {Object.keys(this.props.data.synergy).map(function(
                          key
                        ) {
                          var synergy = this.props.data.synergy[key];
                          return synergy.type === "Origin"
                            ? Object.keys(this.props.originsJSON).map(function(
                                key
                              ) {
                                var origin = this.props.originsJSON[key];
                                var dataArr = {};
                                dataArr[origin.name] = synergy.count;
                                return origin.name === synergy.name &&
                                  origin.set.includes(
                                    parseInt(this.props.set)
                                  ) ? (
                                  <OriginPortrait
                                    origin={origin}
                                    builder={true}
                                    data={dataArr}
                                    rank={synergy.rank}
                                    charactersJSON={this.props.charactersJSON}
                                    patchJSON={this.props.patchJSON}
                                    lang={this.props.lang}
                                    set={this.props.set}
                                  ></OriginPortrait>
                                ) : null;
                              },
                              this)
                            : Object.keys(this.props.typesJSON).map(function(
                                key
                              ) {
                                var type = this.props.typesJSON[key];
                                var dataArr = {};
                                dataArr[type.name] = synergy.count;
                                return type.name === synergy.name &&
                                  type.set.includes(
                                    parseInt(this.props.set)
                                  ) ? (
                                  <TypePortrait
                                    type={type}
                                    builder={true}
                                    data={dataArr}
                                    rank={synergy.rank}
                                    charactersJSON={this.props.charactersJSON}
                                    patchJSON={this.props.patchJSON}
                                    lang={this.props.lang}
                                    set={this.props.set}
                                  ></TypePortrait>
                                ) : null;
                              },
                              this);
                        },
                        this)}
                      </div>
                    </div>
                  </div>
                  <div className="team-expanded-title">{t("Traits")} </div>
                </div>
              </div>
              <div className="team-expanded">
                <div className="team-expanded-group positioning">
                  <div className="team-positioning">
                    <ul
                      id="hexGrid"
                      className={
                        this.props.set === "1" ? "three-row" : "four-row"
                      }
                    >
                      <Hex
                        position="p1"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p2"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p3"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p4"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p5"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p6"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p7"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p8"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p9"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p10"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p11"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p12"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p13"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p14"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p15"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p16"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p17"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p18"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p19"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p20"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      <Hex
                        position="p21"
                        team={this.props.data.characters}
                        charactersJSON={this.props.charactersJSON}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                        set={this.props.set}
                      ></Hex>
                      {this.props.set === "1" ? null : (
                        <React.Fragment>
                          <Hex
                            position="p22"
                            team={this.props.data.characters}
                            charactersJSON={this.props.charactersJSON}
                            patchJSON={this.props.patchJSON}
                            lang={this.props.lang}
                            set={this.props.set}
                          ></Hex>
                          <Hex
                            position="p23"
                            team={this.props.data.characters}
                            charactersJSON={this.props.charactersJSON}
                            patchJSON={this.props.patchJSON}
                            lang={this.props.lang}
                            set={this.props.set}
                          ></Hex>
                          <Hex
                            position="p24"
                            team={this.props.data.characters}
                            charactersJSON={this.props.charactersJSON}
                            patchJSON={this.props.patchJSON}
                            lang={this.props.lang}
                            set={this.props.set}
                          ></Hex>
                          <Hex
                            position="p25"
                            team={this.props.data.characters}
                            charactersJSON={this.props.charactersJSON}
                            patchJSON={this.props.patchJSON}
                            lang={this.props.lang}
                            set={this.props.set}
                          ></Hex>
                          <Hex
                            position="p26"
                            team={this.props.data.characters}
                            charactersJSON={this.props.charactersJSON}
                            patchJSON={this.props.patchJSON}
                            lang={this.props.lang}
                            set={this.props.set}
                          ></Hex>
                          <Hex
                            position="p27"
                            team={this.props.data.characters}
                            charactersJSON={this.props.charactersJSON}
                            patchJSON={this.props.patchJSON}
                            lang={this.props.lang}
                            set={this.props.set}
                          ></Hex>
                          <Hex
                            position="p28"
                            team={this.props.data.characters}
                            charactersJSON={this.props.charactersJSON}
                            patchJSON={this.props.patchJSON}
                            lang={this.props.lang}
                            set={this.props.set}
                          ></Hex>
                        </React.Fragment>
                      )}
                    </ul>
                  </div>
                  <div className="team-expanded-title">{t("Positioning")}</div>
                </div>
                <div className="team-expanded-group options">
                  <div className="team-expanded-list">
                    {Object.keys(this.props.data.replacements).map(function(
                      key
                    ) {
                      var option = this.props.data.replacements[key];
                      return (
                        <div className="team-option">
                          <div className="option-out">
                            {Object.keys(option.out).map(function(key) {
                              var teamCharacter = option.out[key];
                              return Object.keys(this.props.charactersJSON).map(
                                function(key) {
                                  var character = this.props.charactersJSON[
                                    key
                                  ];
                                  return teamCharacter === character.name &&
                                    character.set.includes(
                                      parseInt(this.props.set)
                                    ) ? (
                                    <CharacterPortrait
                                      character={character}
                                      key={key}
                                      patchJSON={this.props.patchJSON}
                                      lang={this.props.lang}
                                      set={this.props.set}
                                    ></CharacterPortrait>
                                  ) : null;
                                },
                                this
                              );
                            }, this)}
                          </div>
                          <i className="arrow down"></i>
                          <div className="option-in">
                            {Object.keys(option.in).map(function(key) {
                              var teamCharacter = option.in[key];
                              return Object.keys(this.props.charactersJSON).map(
                                function(key) {
                                  var character = this.props.charactersJSON[
                                    key
                                  ];
                                  return teamCharacter === character.name &&
                                    character.set.includes(
                                      parseInt(this.props.set)
                                    ) ? (
                                    <CharacterPortrait
                                      character={character}
                                      key={key}
                                      patchJSON={this.props.patchJSON}
                                      lang={this.props.lang}
                                      set={this.props.set}
                                    ></CharacterPortrait>
                                  ) : null;
                                },
                                this
                              );
                            }, this)}
                          </div>
                        </div>
                      );
                    },
                    this)}
                  </div>
                  <div className="team-expanded-title">{t("Options")}</div>
                </div>
              </div>
            </React.Fragment>
          ) : null}
        </div>
      </div>
    );
  }
}
export default withTranslation()(TeamPortrait);
