// Utilities
import React, { Component } from "react";
// Components
import { CharacterPortrait } from "./CharacterPortrait.js";

export class Hex extends Component {
  render() {
    return (
      <li className="hex">
        <div className="hexIn">
          <div className="hexLink">
            {Object.keys(this.props.team).map(function(key) {
              var teamCharacter = this.props.team[key];
              if (teamCharacter.position === this.props.position) {
                return Object.keys(this.props.charactersJSON).map(function(
                  key
                ) {
                  var character = this.props.charactersJSON[key];
                  return teamCharacter.name === character.name &&
                    character.set.includes(parseInt(this.props.set)) ? (
                    <CharacterPortrait
                      character={character}
                      key={key}
                      patchJSON={this.props.patchJSON}
                      lang={this.props.lang}
                      set={this.props.set}
                    ></CharacterPortrait>
                  ) : null;
                },
                this);
              }
              return null;
            }, this)}
          </div>
        </div>
      </li>
    );
  }
}
