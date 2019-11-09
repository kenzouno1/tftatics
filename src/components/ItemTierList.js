// Utilities
import React, { Component } from "react";
// Components
import { ItemPortrait } from "./ItemPortrait.js";

export class ItemTierList extends Component {
  render() {
    return (
      <div className="tier-group">
        <div className={"characters-category " + this.props.css}>
          <h3>{this.props.title}</h3>
        </div>
        <div className="characters-list">
          {Object.keys(this.props.data).map(function(key) {
            var item = this.props.data[key];
            if (item.set.includes(parseInt(this.props.set))) {
              if (item.tier === this.props.tier) {
                return (
                  <ItemPortrait
                    item={item}
                    tier={true}
                    key={key}
                    patchJSON={this.props.patchJSON}
                    lang={this.props.lang}
                  ></ItemPortrait>
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
