/*global overwolf*/
import React, { Component } from "react";
import axios from "axios";
import InGame from "./windows/InGame";
import Windowed from "./windows/Windowed";
import Background from "./windows/Background";
import Intro from "./windows/Intro";
import Tracker from "./windows/Tracker";
// import Team from './windows/Team';
// import CustomTeam from './windows/CustomTeam';
import Rolling from "./windows/Rolling";
import Loading from "./windows/Loading";
// import Recap from './windows/Recap';
import Notice from "./windows/Notice";
// TFT

class Window extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charactersJSON: [],
      itemsJSON: [],
      originsJSON: [],
      typesJSON: [],
      rollingJSON: [],
      metaJSON: [],
      patchJSON: [],
      patchVer: "",
      patchFull: [],
      currentWindowName: "",
      selectedItem: "",
      team: "",
      set: "2",
      scale: 100
    };
    this.openWindow = this.openWindow.bind(this);
    this.setTeam = this.setTeam.bind(this);
    this.setSet = this.setSet.bind(this);
    this.updateSet = this.updateSet.bind(this);
  }
  componentDidMount() {
    var _this = this;
    var windowData = overwolf.windows.getMainWindow();
    axios
      .get("https://rerollcdn.com/data/characters.json")
      .then(function(response) {
        _this.setState({
          charactersJSON: response.data
        });
        return axios.get("https://rerollcdn.com/data/items.json");
      })
      .then(function(response) {
        _this.setState({
          itemsJSON: response.data
        });
        return axios.get("https://rerollcdn.com/data/origins-builder.json");
      })
      .then(function(response) {
        _this.setState({
          originsJSON: response.data
        });
        return axios.get("https://rerollcdn.com/data/types-builder.json");
      })
      .then(function(response) {
        _this.setState({
          typesJSON: response.data
        });
        return axios.get("https://rerollcdn.com/data/rolling.json");
      })
      .then(function(response) {
        _this.setState({
          rollingJSON: response.data
        });
        return axios.get("https://rerollcdn.com/data/meta.json");
      })
      .then(function(response) {
        _this.setState({
          metaJSON: response.data
        });
        return axios.get("https://rerollcdn.com/data/patch.json");
      })
      .then(function(response) {
        _this.setState({
          patchJSON: response.data.Notes,
          patchVer: response.data.Ver
        });
        if ("set" in windowData.localStorage) {
          _this.setState({
            set: windowData.localStorage.set
          });
          console.log("set localStorage found: " + windowData.localStorage.set);
        } else {
          _this.setState({
            set: response.data.Set
          });
        }
        return axios.get(
          "https://cdn.contentful.com/spaces/z1yb6g2ffrt0/environments/master/entries?access_token=4548144c0215cc99ea7d69254167da49381cbc7bc64aa5661efb7f800cfaff23&order=-sys.createdAt"
        );
      })
      .then(function(response) {
        var patchArr = [];
        Object.keys(response.data.items).map(function(key) {
          var item = response.data.items[key];
          if (item.sys.contentType.sys.id === "patchTftactics") {
            patchArr.push(item);
          }
          return null;
        });
        _this.setState({
          patchFull: patchArr
        });
      })
      .catch(function(error) {
        console.log(error);
      });
    overwolf.windows.getCurrentWindow(result => {
      this.setState({
        currentWindowName: result.window.name
      });
    });
  }

  openWindow(e) {
    const attr = e.currentTarget.attributes;
    overwolf.windows.obtainDeclaredWindow(attr.page.value, function(result) {
      if (result.status === "success") {
        overwolf.windows.restore(result.window.id);
      }
    });
  }

  setTeam(e) {
    this.setState(
      {
        team: e.currentTarget.attributes.team.value
      },
      () => {
        overwolf.windows.obtainDeclaredWindow("team", function(result) {
          if (result.status === "success") {
            overwolf.windows.restore(result.window.id);
          }
        });
      }
    );
  }

  setSet(e) {
    var selectedSet = e.currentTarget.attributes.set.value;
    this.setState({
      set: selectedSet
    });
    localStorage.setItem("set", selectedSet);
    overwolf.windows.sendMessage("windowed", "set", selectedSet, function(
      response
    ) {
      if (response.status === "error") {
        console.log("Set Message Failed!");
      } else if (response.status === "success") {
        console.log("Set Message Sent to Windowed:" + selectedSet);
      }
    });
    overwolf.windows.sendMessage("rolling", "set", selectedSet, function(
      response
    ) {
      if (response.status === "error") {
        console.log("Set Message Failed!");
      } else if (response.status === "success") {
        console.log("Set Message Sent to Rolling:" + selectedSet);
      }
    });
    overwolf.windows.sendMessage("tracker", "set", selectedSet, function(
      response
    ) {
      if (response.status === "error") {
        console.log("Set Message Failed!");
      } else if (response.status === "success") {
        console.log("Set Message Sent to Tracker:" + selectedSet);
      }
    });
    console.log("Set localstorage set to: " + selectedSet);
  }

  updateSet(a) {
    this.setState({
      set: a
    });
  }

  render() {
    const windowName = this.state.currentWindowName;
    let body = document.getElementsByTagName("body")[0];
    switch (windowName) {
      case "background":
        body.className = "background";
        return <Background />;

      case "intro":
        body.className = "intro";
        return <Intro changeWindow={this.openWindow} />;

      case "ingame":
        body.className = "in-game";
        return (
          <InGame
            setTeam={this.setTeam}
            charactersJSON={this.state.charactersJSON}
            itemsJSON={this.state.itemsJSON}
            originsJSON={this.state.originsJSON}
            typesJSON={this.state.typesJSON}
            metaJSON={this.state.metaJSON}
            patchJSON={this.state.patchJSON}
            patchFull={this.state.patchFull}
            patchVer={this.state.patchVer}
            set={this.state.set}
            setSet={this.setSet}
          />
        );

      case "windowed":
        return (
          <Windowed
            changeWindow={this.openWindow}
            itemsJSON={this.state.itemsJSON}
            patchJSON={this.state.patchJSON}
            set={this.state.set}
            updateSet={this.updateSet}
          />
        );

      case "tracker":
        body.className = "tracker";
        return (
          <Tracker
            charactersJSON={this.state.charactersJSON}
            itemsJSON={this.state.itemsJSON}
            originsJSON={this.state.originsJSON}
            typesJSON={this.state.typesJSON}
            metaJSON={this.state.metaJSON}
            patchJSON={this.state.patchJSON}
            openWindow={this.openWindow}
            set={this.state.set}
            updateSet={this.updateSet}
          />
        );

      case "rolling":
        body.className = "rolling";
        return (
          <Rolling
            rollingJSON={this.state.rollingJSON}
            charactersJSON={this.state.charactersJSON}
            itemsJSON={this.state.itemsJSON}
            patchJSON={this.state.patchJSON}
            set={this.state.set}
            updateSet={this.updateSet}
          />
        );

      case "loading":
        body.className = "loading";
        return <Loading />;
      case "notice":
        body.className = "notice";
        return <Notice patchVer={this.state.patchVer} />;
      default:
        return <div>Nothing to print</div>;
    }
  }
}

export default Window;
