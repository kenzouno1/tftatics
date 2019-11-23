// Utilities
import React, { Component } from "react";
// Components
import CharacterPortrait from "./CharacterPortrait.js";

export class BoardPortrait extends Component {
  render() {
    return (
      <div className="team-wrapper">
        <div className="team-portrait">
          <div className="team-portrait-main">
            <div className="team-characters">
              {Object.keys(this.props.characters).map(function(key) {
                var teamCharacter = this.props.characters[key];
                return Object.keys(this.props.charactersJSON).map(function(
                  key
                ) {
                  var character = this.props.charactersJSON[key];
                  if (character.active) {
                    if (character.set.includes(parseInt(this.props.set))) {
                      return teamCharacter.name.toLowerCase() ===
                        character.name.replace(/ /g, "").toLowerCase() ? (
                        <CharacterPortrait
                          character={character}
                          key={key}
                          items={
                            teamCharacter.items ? teamCharacter.items : null
                          }
                          team={true}
                          itemsJSON={this.props.itemsJSON}
                          patchJSON={this.props.patchJSON}
                          lang={this.props.lang}
                          board={true}
                          level={teamCharacter.level}
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
