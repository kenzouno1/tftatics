// Utilities
import React, { Component } from "react";
// Components
import { ChampionTierList } from "./ChampionTierList.js";
import { OriginTierList } from "./OriginTierList.js";
import { TypeTierList } from "./TypeTierList.js";
import { ItemTierList } from "./ItemTierList.js";

export class TierLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tier: "Champions"
    };
    this.setCategory = this.setCategory.bind(this);
  }
  setCategory(e) {
    this.setState({
      tier: e.currentTarget.attributes.category.value
    });
  }
  render() {
    return (
      <main
        className={
          "tierlist " +
          (this.state.tier === "Origins" || this.state.tier === "Classes"
            ? "races"
            : "characters-tier")
        }
      >
        <div className="sidebar">
          <div className="sidebar-navigation">
            <div
              className={
                "characters-category" +
                (this.state.tier === "Champions" ? " active" : "")
              }
              category={"Champions"}
              onClick={this.setCategory}
            >
              <h3>{this.props.lang === "en" ? "Champions" : "英雄详情"}</h3>
              <img
                src={require("../images/nav/nav-arrow.svg")}
                alt="Arrow"
              ></img>
            </div>
            <div
              className={
                "characters-category" +
                (this.state.tier === "Origins" ? " active" : "")
              }
              category={"Origins"}
              onClick={this.setCategory}
            >
              <h3>{this.props.lang === "en" ? "Origins" : "种族"}</h3>
              <img
                src={require("../images/nav/nav-arrow.svg")}
                alt="Arrow"
              ></img>
            </div>
            <div
              className={
                "characters-category" +
                (this.state.tier === "Classes" ? " active" : "")
              }
              category={"Classes"}
              onClick={this.setCategory}
            >
              <h3>{this.props.lang === "en" ? "Classes" : "职业"}</h3>
              <img
                src={require("../images/nav/nav-arrow.svg")}
                alt="Arrow"
              ></img>
            </div>
            <div
              className={
                "characters-category" +
                (this.state.tier === "Items" ? " active" : "")
              }
              category={"Items"}
              onClick={this.setCategory}
            >
              <h3>{this.props.lang === "en" ? "Items" : "装备"}</h3>
              <img
                src={require("../images/nav/nav-arrow.svg")}
                alt="Arrow"
              ></img>
            </div>
          </div>
          <div className="disclaimer">
            <p>
              {this.props.lang === "en"
                ? "The order within the tiers does not matter."
                : "同一等级排名不分先后"}
            </p>
          </div>
        </div>

        <div className="main main-wrapper">
          <div className="header-wrapper">
            <h1>
              {this.props.lang === "en" ? "Tier List" : "排名列表"} -{" "}
              {this.state.tier}
            </h1>
            <div className="legend">
              <div className="legend-item">
                <div className="legend-up">▴</div>
                {this.props.lang === "en" ? "Tier Up" : "排名上升"}
              </div>
              <div className="legend-item">
                <div className="legend-down">▾</div>
                {this.props.lang === "en" ? "Tier Down" : "排名下降"}
              </div>
              <div className="legend-item">
                <div className="legend-new">N</div>
                {this.props.lang === "en" ? "New" : "新的"}
              </div>
            </div>
          </div>
          {this.state.tier === "Champions" ? (
            <React.Fragment>
              <ChampionTierList
                data={this.props.charactersJSON}
                title={"S"}
                css={"tone"}
                tier={1}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></ChampionTierList>
              <ChampionTierList
                data={this.props.charactersJSON}
                title={"A"}
                css={"ttwo"}
                tier={2}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></ChampionTierList>
              <ChampionTierList
                data={this.props.charactersJSON}
                title={"B"}
                css={"tthree"}
                tier={3}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></ChampionTierList>
              <ChampionTierList
                data={this.props.charactersJSON}
                title={"C"}
                css={"tfour"}
                tier={4}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></ChampionTierList>
              <ChampionTierList
                data={this.props.charactersJSON}
                title={"D"}
                css={"tfive"}
                tier={5}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></ChampionTierList>
              <ChampionTierList
                data={this.props.charactersJSON}
                title={"E"}
                css={"tsix"}
                tier={6}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></ChampionTierList>
            </React.Fragment>
          ) : null}
          {this.state.tier === "Origins" ? (
            <React.Fragment>
              <OriginTierList
                data={this.props.originsJSON}
                charactersJSON={this.props.charactersJSON}
                title={"S"}
                css={"tone"}
                tier={1}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></OriginTierList>
              <OriginTierList
                data={this.props.originsJSON}
                charactersJSON={this.props.charactersJSON}
                title={"A"}
                css={"ttwo"}
                tier={2}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></OriginTierList>
              <OriginTierList
                data={this.props.originsJSON}
                charactersJSON={this.props.charactersJSON}
                title={"B"}
                css={"tthree"}
                tier={3}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></OriginTierList>
              <OriginTierList
                data={this.props.originsJSON}
                charactersJSON={this.props.charactersJSON}
                title={"C"}
                css={"tfour"}
                tier={4}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></OriginTierList>
              <OriginTierList
                data={this.props.originsJSON}
                charactersJSON={this.props.charactersJSON}
                title={"D"}
                css={"tfive"}
                tier={5}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></OriginTierList>
            </React.Fragment>
          ) : null}
          {this.state.tier === "Classes" ? (
            <React.Fragment>
              <TypeTierList
                data={this.props.typesJSON}
                charactersJSON={this.props.charactersJSON}
                title={"S"}
                css={"tone"}
                tier={1}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></TypeTierList>
              <TypeTierList
                data={this.props.typesJSON}
                charactersJSON={this.props.charactersJSON}
                title={"A"}
                css={"ttwo"}
                tier={2}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></TypeTierList>
              <TypeTierList
                data={this.props.typesJSON}
                charactersJSON={this.props.charactersJSON}
                title={"B"}
                css={"tthree"}
                tier={3}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></TypeTierList>
              <TypeTierList
                data={this.props.typesJSON}
                charactersJSON={this.props.charactersJSON}
                title={"C"}
                css={"tfour"}
                tier={4}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></TypeTierList>
              <TypeTierList
                data={this.props.typesJSON}
                charactersJSON={this.props.charactersJSON}
                title={"D"}
                css={"tfive"}
                tier={5}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></TypeTierList>
            </React.Fragment>
          ) : null}
          {this.state.tier === "Items" ? (
            <React.Fragment>
              <ItemTierList
                data={this.props.itemsJSON}
                charactersJSON={this.props.charactersJSON}
                title={"S"}
                css={"tone"}
                tier={1}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></ItemTierList>
              <ItemTierList
                data={this.props.itemsJSON}
                charactersJSON={this.props.charactersJSON}
                title={"A"}
                css={"ttwo"}
                tier={2}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></ItemTierList>
              <ItemTierList
                data={this.props.itemsJSON}
                charactersJSON={this.props.charactersJSON}
                title={"B"}
                css={"tthree"}
                tier={3}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></ItemTierList>
              <ItemTierList
                data={this.props.itemsJSON}
                charactersJSON={this.props.charactersJSON}
                title={"C"}
                css={"tfour"}
                tier={4}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></ItemTierList>
              <ItemTierList
                data={this.props.itemsJSON}
                charactersJSON={this.props.charactersJSON}
                title={"D"}
                css={"tfive"}
                tier={5}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></ItemTierList>
              <ItemTierList
                data={this.props.itemsJSON}
                charactersJSON={this.props.charactersJSON}
                title={"?"}
                css={"tsix"}
                tier={6}
                patchJSON={this.props.patchJSON}
                lang={this.props.lang}
                set={this.props.set}
              ></ItemTierList>
            </React.Fragment>
          ) : null}
        </div>
      </main>
    );
  }
}
