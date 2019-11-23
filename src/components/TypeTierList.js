// Utilities
import React, { Component } from "react";
// Components
import TypePortrait  from "./TypePortrait.js";

export class TypeTierList extends Component {
  render() {
    return (
      <div className="tier-group">
        <div className={"characters-category " + this.props.css}>
          <h3>{this.props.title}</h3>
        </div>
        <div className="characters-list">
          {Object.keys(this.props.data).map(function(key) {
            var type = this.props.data[key];
            if (type.set.includes(parseInt(this.props.set))) {
              if (type.tier === this.props.tier) {
                return (
                  <TypePortrait
                    type={type}
                    tier={true}
                    key={key}
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
        </div>
      </div>
    );
  }
}
