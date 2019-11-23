// Utilities
import React, { Component } from "react";
// Components
import CharacterPortrait from "./CharacterPortrait.js";

export class CustomTeamPortrait extends Component {
  render() {
    return (
      <div className="team-wrapper">
        <div className="team-portrait">
          <div className="team-portrait-main">
            <div className="team-characters">
              {Object.keys(this.props.data).map(function(key) {
                var characterKey = this.props.data[key];
                return Object.keys(this.props.charactersJSON).map(function(
                  key
                ) {
                  var character = this.props.charactersJSON[key];
                  if (character.active) {
                    if (character.set.includes(parseInt(this.props.set))) {
                      return character.id === characterKey ? (
                        <CharacterPortrait
                          character={character}
                          key={key}
                          patchJSON={this.props.patchJSON}
                          lang={this.props.lang}
                          set={this.props.set}
                        ></CharacterPortrait>
                      ) : null;
                    }
                  }
                  return null;
                },
                this);
              }, this)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
