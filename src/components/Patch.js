import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
// TFT
// Components
import { Divider } from "../components/Divider";
import { withTranslation } from "react-i18next";

class Patch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPost: 0,
      totalPosts: 5
    };
    this.showPosts = this.showPosts.bind(this);
    this.setPost = this.setPost.bind(this);
  }

  showPosts() {
    this.setState({
      totalPosts:
        this.state.totalPosts === this.props.patchFull.length
          ? 5
          : this.props.patchFull.length
    });
  }

  setPost(e) {
    this.setState({
      currentPost: parseInt(e.currentTarget.attributes.pos.value)
    });
  }

  componentDidMount() {
    this.props.clearPatchNew();
  }

  render() {
    const { t } = this.props;
    return (
      <main className="patch">
        <div className="sidebar">
          <div className="sidebar-navigation">
            {Object.keys(this.props.patchFull).map(function(key) {
              var post = this.props.patchFull[key];
              if (this.state.totalPosts > key) {
                return (
                  <div
                    className={
                      "characters-category" +
                      (this.state.currentPost === parseInt(key)
                        ? " active"
                        : "")
                    }
                    pos={key}
                    key={post.fields.title}
                    onClick={this.setPost}
                  >
                    <h3>{post.fields.title}</h3>
                    <img
                      src={require("../images/nav/nav-arrow.svg")}
                      alt="Arrow"
                    ></img>
                  </div>
                );
              } else {
                return null;
              }
            }, this)}
          </div>
          {this.props.patchFull.length > 1 ? (
            <div className="btn expand" onClick={this.showPosts}>
              {this.state.totalPosts === this.props.patchFull.length
                ? t("Show Less")
                : t("Show All")}
            </div>
          ) : null}
        </div>

        <div className="main main-wrapper">
          {Object.keys(this.props.patchFull).map(function(key) {
            var post = this.props.patchFull[key];
            if (this.state.currentPost === parseInt(key)) {
              return (
                <div className="post">
                  <div className="page-header">
                    <h1>{t("Patch Notes")}</h1>
                    <h4>{post.fields.title}</h4>
                  </div>
                  <Divider></Divider>
                  <div className="article" key={post.fields.title}>
                    <ReactMarkdown
                      source={post.fields.description}
                    ></ReactMarkdown>
                  </div>
                </div>
              );
            } else {
              return null;
            }
          }, this)}
        </div>
      </main>
    );
  }
}
export default withTranslation()(Patch);
