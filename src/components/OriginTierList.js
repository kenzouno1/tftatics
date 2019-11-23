// Utilities
import React, { Component } from "react";
// Components
import OriginPortrait from "./OriginPortrait.js";

export class OriginTierList extends Component {
  render() {
    return (
      <div className="tier-group">
        <div className={"characters-category " + this.props.css}>
          <h3>{this.props.title}</h3>
        </div>
        <div className="characters-list">
          {Object.keys(this.props.data).map(function(key) {
            var origin = this.props.data[key];
            if (origin.set.includes(parseInt(this.props.set))) {
              if (origin.tier === this.props.tier) {
                return (
                  <OriginPortrait
                    origin={origin}
                    tier={true}
                    key={key}
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
        </div>
      </div>
    );
  }
}
