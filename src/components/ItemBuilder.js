import React, { Component } from "react";
// TFT
// Utilities
import ReactTable from "react-table";
import "react-table/react-table.css";
// Components
import { SearchBar } from "../components/SearchBar";
import ItemPortrait from "../components/ItemPortrait";
import { withTranslation } from "react-i18next";
class ItemBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      selectItem: "B.F. Sword",
      selectType: "Base",
      activeCategory: "Base",
      adActive: false
    };
    this.updateSearch = this.updateSearch.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.setCategory = this.setCategory.bind(this);
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
  selectItem(e) {
    this.setState({
      selectItem: e.currentTarget.attributes.name.value,
      selectType: e.currentTarget.attributes.type.value
    });
  }
  setCategory(e) {
    this.setState({
      activeCategory: e.currentTarget.attributes.category.value
    });
  }

  render() {
    const { t } = this.props;
    //TFT
    const columns = [
      {
        Header: t("Recipe"),
        accessor: "name",
        minWidth: 80,
        Cell: props => (
          <React.Fragment>
            {Object.keys(this.props.itemsJSON).map(function(key) {
              var item = this.props.itemsJSON[key];
              return item.name === this.state.selectItem ? (
                <ItemPortrait
                  item={item}
                  builder={true}
                  selectItem={this.selectItem}
                  activeItem={this.state.selectItem}
                  key={key}
                  patchJSON={this.props.patchJSON}
                  lang={this.props.lang}
                ></ItemPortrait>
              ) : null;
            }, this)}
            <ItemPortrait
              item={props.original}
              builder={true}
              selectItem={this.selectItem}
              activeItem={this.state.selectItem}
              patchJSON={this.props.patchJSON}
              lang={this.props.lang}
            ></ItemPortrait>
          </React.Fragment>
        )
      },
      {
        Header: t("Combines Into"),
        accessor: "bonus",
        minWidth: 300,
        style: { flexWrap: "nowrap" },
        Cell: ({ row }) => {
          return Object.keys(this.props.itemsJSON).map(function(key) {
            var item = this.props.itemsJSON[key];
            var compareArr = [];
            compareArr.push(this.state.selectItem, row.name);
            if (item.set.includes(parseInt(this.props.set))) {
              return item.combine ? (
                (item.combine[0] === compareArr[0] &&
                  item.combine[1] === compareArr[1]) ||
                (item.combine[0] === compareArr[1] &&
                  item.combine[1] === compareArr[0]) ? (
                  <React.Fragment key={key}>
                    <ItemPortrait
                      item={item}
                      builder={true}
                      selectItem={this.selectItem}
                      activeItem={this.state.selectItem}
                      patchJSON={this.props.patchJSON}
                      lang={this.props.lang}
                    ></ItemPortrait>
                    {this.props.lang !== "ch"
                      ? Object.keys(item.bonus).map(function(key) {
                          var bonus = item.bonus[key];
                          return (
                            <div className="item-bonus" key={bonus}>
                              {bonus}
                            </div>
                          );
                        }, this)
                      : Object.keys(item.bonus_ch).map(function(key) {
                          var bonus = item.bonus_ch[key];
                          return (
                            <div className="item-bonus" key={bonus}>
                              {bonus}
                            </div>
                          );
                        }, this)}
                  </React.Fragment>
                ) : null
              ) : null;
            }
            return null;
          }, this);
        }
      }
    ];
    const combineColumns = [
      {
        Header: t("Recipe"),
        accessor: "combine",
        minWidth: 80,
        Cell: ({ row }) => {
          return row.combine
            ? Object.keys(row.combine).map(function(key) {
                var combineItem = row.combine[key];
                return Object.keys(this.props.itemsJSON).map(function(key) {
                  var item = this.props.itemsJSON[key];
                  return item.name === combineItem ? (
                    <ItemPortrait
                      item={item}
                      builder={true}
                      selectItem={this.selectItem}
                      activeItem={this.state.selectItem}
                      key={key}
                      patchJSON={this.props.patchJSON}
                      lang={this.props.lang}
                    ></ItemPortrait>
                  ) : null;
                }, this);
              }, this)
            : null;
        }
      },
      {
        Header: t("Combines Into"),
        accessor: "name",
        minWidth: 300,
        style: { flexWrap: "nowrap" },
        Cell: props => (
          <React.Fragment>
            <ItemPortrait
              item={props.original}
              builder={true}
              selectItem={this.selectItem}
              activeItem={this.state.selectItem}
              patchJSON={this.props.patchJSON}
              lang={this.props.lang}
            ></ItemPortrait>
            {this.props.lang !== "ch"
              ? Object.keys(props.original.bonus).map(function(key) {
                  var bonus = props.original.bonus[key];
                  return (
                    <div className="item-bonus" key={bonus}>
                      {bonus}
                    </div>
                  );
                }, this)
              : Object.keys(props.original.bonus_ch).map(function(key) {
                  var bonus = props.original.bonus_ch[key];
                  return (
                    <div className="item-bonus" key={bonus}>
                      {bonus}
                    </div>
                  );
                }, this)}
          </React.Fragment>
        )
      }
    ];
    // Filter Data
    let itemsBase = [];
    let itemsCombined = [];
    let selectedItem = [];
    Object.keys(this.props.itemsJSON).map(function(key) {
      var item = this.props.itemsJSON[key];
      if (item.set.includes(parseInt(this.props.set))) {
        return item.into ? itemsBase.push(item) : itemsCombined.push(item);
      }
      return null;
    }, this);
    Object.keys(this.props.itemsJSON).map(function(key) {
      var item = this.props.itemsJSON[key];
      if (item.set.includes(parseInt(this.props.set))) {
        return item.name === this.state.selectItem
          ? selectedItem.push(item)
          : null;
      }
      return null;
    }, this);

    return (
      <main className="item-builder">
        <div className="sidebar">
          <div className="sidebar-navigation">
            <div
              className={
                "characters-category" +
                (this.state.activeCategory === "Base" ? " active" : "")
              }
              category="Base"
              onClick={this.setCategory}
            >
              <h3>{t("Base Items")}</h3>
            </div>
            <div
              className={
                "characters-category" +
                (this.state.activeCategory === "Combined" ? " active" : "")
              }
              category="Combined"
              onClick={this.setCategory}
            >
              <h3>{t("Combined Items")}</h3>
            </div>
          </div>
          <div className="searchbar-wrapper">
            <SearchBar
              searchValue={this.state.searchValue}
              placeholderValue={t("Search for an item...")}
              updateSearch={this.updateSearch}
              clearSearch={this.clearSearch}
            />
          </div>
          <div className="characters-list">
            {this.state.activeCategory === "Base"
              ? Object.keys(itemsBase).map(function(key) {
                  var item = itemsBase[key];
                  if (
                    this.state.searchValue === "" ||
                    item.name
                      .replace(/\./g, "")
                      .replace(/'/g, "")
                      .toLowerCase()
                      .includes(this.state.searchValue.toLowerCase())
                  ) {
                    return (
                      <ItemPortrait
                        item={item}
                        builder={true}
                        selectItem={this.selectItem}
                        activeItem={this.state.selectItem}
                        key={key}
                        base={true}
                        patchJSON={this.props.patchJSON}
                        lang={this.props.lang}
                      ></ItemPortrait>
                    );
                  }
                  return null;
                }, this)
              : Object.keys(itemsCombined).map(function(key) {
                  var item = itemsCombined[key];
                  return this.state.searchValue === "" ||
                    item.name
                      .replace(/\./g, "")
                      .replace(/'/g, "")
                      .toLowerCase()
                      .includes(this.state.searchValue.toLowerCase()) ? (
                    <ItemPortrait
                      item={item}
                      builder={true}
                      selectItem={this.selectItem}
                      activeItem={this.state.selectItem}
                      key={key}
                      patchJSON={this.props.patchJSON}
                      lang={this.props.lang}
                    ></ItemPortrait>
                  ) : null;
                }, this)}
          </div>
          {/* <div id='ad-div-items' className="ow-ad"></div> */}
        </div>

        <div className="table main-wrapper">
          {this.state.selectItem === ""
            ? null
            : Object.keys(this.props.itemsJSON).map(function(key) {
                var item = this.props.itemsJSON[key];
                if (item.set.includes(parseInt(this.props.set))) {
                  return item.name === this.state.selectItem ? (
                    <div className="overlay-title">
                      <img
                        className="overlay-icon"
                        src={
                          "https://rerollcdn.com/items/" +
                          item.name
                            .replace(/ /g, "")
                            .replace(/\./g, "")
                            .replace(/'/g, "") +
                          ".png"
                        }
                        alt={item.name}
                      ></img>
                      <div className="overlay-bonus-title">
                        {this.props.lang !== "ch" ? item.name : item.name_ch}
                        <div className="item-stats-wrapper">
                          {item.stats
                            ? Object.keys(item.stats).map(function(key) {
                                var stat = item.stats[key];
                                return (
                                  <div className="item-stats" key={key}>
                                    <img
                                      className="item-stat-icon"
                                      src={require("../images/ui/icon-" +
                                        stat.name +
                                        ".svg")}
                                      alt={stat.name}
                                    ></img>
                                    +{stat.value}
                                  </div>
                                );
                              }, this)
                            : null}
                        </div>
                      </div>
                    </div>
                  ) : null;
                }
                return null;
              }, this)}
          <ReactTable
            className="-striped"
            data={this.state.selectType === "Base" ? itemsBase : selectedItem}
            columns={
              this.state.selectType === "Base" ? columns : combineColumns
            }
            showPagination={false}
            resizable={false}
            minRows={1}
            defaultPageSize={100}
            sortable={false}
          />
        </div>
      </main>
    );
  }
}
export default withTranslation()(ItemBuilder);
