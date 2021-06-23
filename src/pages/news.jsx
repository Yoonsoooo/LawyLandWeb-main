import "../stylesheets/news.css";
import Content from "./class/Content";
import Util_ from "./class/GlobalFtn";
import Fullscreen from "./class/Fullscreen";
import NewsDetails from "./class/NewsDetails.jsx";
import React from "react";
import Popup from "./class/Popup";

import news_back_img from "../images/news_backimg.png";

import { withRouter } from "react-router-dom";

function NewsPreshow(index_, data_, isClick) {
  return class extends React.Component {
    async Action_details_news(num_) {
      console.log(num_);
      var from_img_ = [
        "/bucket/cardnews3.png",
        "/bucket/cardnews3_1.png",
        "/bucket/cardnews3_2.png",
        "/bucket/cardnews3_3.png",
        "/bucket/cardnews3_4.png",
        "/bucket/cardnews3_5.png",
        "/bucket/cardnews3_6.png",
        "/bucket/cardnews3_7.png",
      ];
      var from_server_ = await Util_.cli_to_server(
        "/news/req_details",
        { num: num_, user: DataInfo.return_user_num() },
        "POST"
      );
      if (!from_server_.success)
        return Popup.Create_popup(null, from_server_.message, "창닫기");
      var clicked_content_ = Util_.find_data_from_dataSource(
        DataInfo.get_page_memmory("ResArr"),
        num_
      );
      var showing_content_ = {};
      showing_content_.details = clicked_content_;
      showing_content_.comment = from_server_.message;
      DataInfo.set_page_value("ShowingContent", showing_content_);
      Popup.Action_cancel_button();
      Fullscreen.Create_fullscreen(NewsDetails(num_, from_img_));
    }

    render() {
      return React.createElement(
        "div",
        { key: index_, className: "news_preshow_container normal_text" },
        React.createElement("img", { src: "/bucket/cardnews1.png" }),
        React.createElement(
          "div",
          { className: "news_preshow_header" },
          React.createElement(
            "div",
            { className: "news_preshow_title" },
            data_.title
          ),
          React.createElement(
            "div",
            { className: "news_preshow_text" },
            data_.up_date
          ),
          React.createElement(
            "div",
            { className: "news_preshow_text" },
            data_.proponent
          ),
          React.createElement(
            "div",
            {
              className: "button_style2",
              onClick: this.Action_details_news.bind(this, data_.num),
            },
            "전문 보기"
          )
        )
      );
    }
  };
}

class News extends React.Component {
  constructor(props) {
    super(props);
    this.offset = 0;
    this.state = {
      get_more_data: this.get_more_data.bind(this),
      isClick: this.props.handleUpdateClick.bind(this),
    };
  }
  async get_more_data() {
    var from_server_ = await Util_.cli_to_server(
      "/news/req_preshow",
      { offset: this.offset },
      "POST"
    );
    if (!from_server_.success) return false;
    DataInfo.set_page_value(
      "ResArr",
      DataInfo.get_page_memmory("ResArr").concat(from_server_.message)
    );
    this.offset = this.offset + from_server_.message.length;
    var temp_ = 0;
    for (var i = 0; i < 210; i++) {
      temp_ = 0;
      for (var a = 0; a < DataInfo.get_page_memmory("ResArr").length; a++) {
        if (i == DataInfo.get_page_memmory("ResArr")[a]["num"]) temp_ += 1;
      }
      if (temp_ > 1) console.log(i, temp_);
    }
    return this.offset;
  }
  async get_news_preshow() {
    var from_server_ = await Util_.cli_to_server(
      "/news/req_preshow",
      { offset: this.offset },
      "POST"
    );
    if (!from_server_.success)
      return Popup.Create_popup(null, from_server_.message, "창닫기");
    DataInfo.set_page_value("ResArr", from_server_.message);
    Util_.make_element(
      ContentList.MakeContentList(this.state, NewsPreshow),
      "news_mid"
    );
  }
  componentDidMount() {
    if (DataInfo.return_page_num() != 9) {
      console.log("not page 9, re init");
      this.props.page_move(9, "News", false, false);
    }
    DataInfo.init_page_memory({
      SelectedCategory: { index: 0, selector: Util_.dbdi("num") }, //0:작성글,1:답변글,2:작성복대리,3:답변복대리,4:스크랩,5:후속
      ResArr: [],
      ShowingPage: { now: 0, end: null }, //페이지 넘버 관련
      ShowingContent: null,
      ShowingContentNum: null,
    });
    this.get_news_preshow();
  }
  render() {
    return React.createElement(
      "div",
      { id: "news" },
      React.createElement(
        "div",
        { id: "news_top" },
        React.createElement("img", { id: "news_top_back", src: news_back_img }),
        React.createElement(
          "div",
          { style: { position: "relative" } },
          React.createElement(
            "div",
            { id: "news_top_menu" },
            React.createElement("div", { id: "blank_space" }),
            React.createElement("div", { id: "news_logo" }, "Law리포터"),
            React.createElement(
              "div",
              { id: "news_menu_container", className: "inline_container" },
              React.createElement(
                "div",
                { className: "news_category" },
                "카드뉴스"
              )
            )
          )
        )
      ),
      React.createElement("div", { id: "news_mid" })
    );
  }
}

export default withRouter(News);
