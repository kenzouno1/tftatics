import React, { Component } from "react";

export class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocus: false,
      searchValue: ""
    };

    this.searchFocus = this.searchFocus.bind(this);
    this.searchBlur = this.searchBlur.bind(this);
  }

  searchFocus() {
    this.setState({
      isFocus: true
    });
  }
  searchBlur() {
    this.setState({
      isFocus: false
    });
  }

  render() {
    return (
      <div
        className={
          "searchbar" +
          (this.state.isFocus || this.props.searchValue !== ""
            ? " focused"
            : "")
        }
      >
        <img
          className="searchbar-icon"
          src={require("../images/search-icon.svg")}
          alt="search icon"
        ></img>
        <input
          className="searchbar-input"
          type="text"
          placeholder={this.props.placeholderValue}
          onFocus={this.searchFocus}
          onBlur={this.searchBlur}
          onChange={this.props.updateSearch}
          value={this.props.searchValue}
        ></input>
        <img
          className={
            "searchbar-close" + (this.props.searchValue !== "" ? " active" : "")
          }
          src={require("../images/close-icon.svg")}
          alt="close icon"
          onClick={this.props.clearSearch}
        ></img>
      </div>
    );
  }
}
