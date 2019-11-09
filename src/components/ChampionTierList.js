// Utilities
import React, { Component } from "react";
// Components
import { CharacterPortrait } from "./CharacterPortrait.js";

export class ChampionTierList extends Component {
  render() {
    return (
      <div className="tier-group">
        <div className={"characters-category " + this.props.css}>
          <h3>{this.props.title}</h3>
        </div>
        <div className="characters-list">
          {Object.keys(this.props.data).map(function(key) {
            var character = this.props.data[key];
            if (character.active) {
              if (character.set.includes(parseInt(this.props.set))) {
                if (character.tier === this.props.tier) {
                  return (
                    <CharacterPortrait
                      character={character}
                      tierlist={true}
                      key={key}
                      patchJSON={this.props.patchJSON}
                      lang={this.props.lang}
                      set={this.props.set}
                    ></CharacterPortrait>
                  );
                }
              }
            }
            return null;
          }, this)}
        </div>
      </div>
    );
  }
}
