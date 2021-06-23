import React from "react";
import Util_ from "./class/GlobalFtn";
import Fullscreen from "./class/Fullscreen";
import Popup from "./class/Popup";
import Content from "./class/Content";
import check from "./class/CheckForm";
import "../stylesheets/home.css";
import NewsDetails from "./class/NewsDetails.jsx";

import move_black_img from "../images/moveblackicon.png";
import lawreport_img from "../images/LAWreport.png";
import lefticon_img from "../images/lefticon.png";
import righticon_img from "../images/righticon.png";
import move_yellow_img from "../images/moveyellowicon.png";

import { withRouter } from "react-router-dom";

async function check_form_get_data(data_) {
  console.log(data_);
  if (!check.isNumberRange(data_.place, 17, 1)) {
    return { success: false, message: "잘못된 place 입니다" };
  }

  return { success: true, message: null };
}

let NewsData = [
  {
    img: "",
    title: "공휴일법 제정안",
    date: "2021.05.10.",
    proponent: "강병원 의원",
  },
  {
    img: "",
    title: "군형법 개정안",
    date: "2021.06.08.",
    proponent: "전용기 의원",
  },
  {
    img: "",
    title: "변호사 역활 확대 3법",
    date: "2021.06.10.",
    proponent: "전주혜 의원",
  },
];

function Make_cardnews_details(img_, data_) {
  const details_ele_ = img_.map((val_, index_) => {
    return React.createElement("img", {
      key: index_,
      className: "cardnews_deails_img",
    });
  });
  return React.createElement(
    "div",
    { id: "news_details_container" },
    details_ele_,
    React.createElement(
      "div",
      { className: "content_preshow_container" },
      React.createElement("div", null, data_.text1),
      React.createElement("div", null, data_.text2),
      React.createElement("div", null, data_.text3)
    )
  );
}

function Action_details_news(num_) {
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
  var showing_content_ = {};
  DataInfo.set_page_value("ShowingContent", showing_content_);
  Popup.Action_cancel_button();
  Fullscreen.Create_fullscreen(NewsDetails(num_, from_img_));
}

class Home extends React.Component {
  constructor() {
    super();
    this.news_flag = 0;
    this.news_length = 0;
    this.state = {
      radio_class: [],
      news_img: "",
      news_text1: "",
      news_text2: "",
      news_text3: "",
      radio_ele_: [],
      content_ele_: [],
      double_ele_: [],
    };
  }
  event_home_page(type_, val_, e) {
    console.log(type_, val_);
    if (type_ == "click_page_move") this.move_page_button(val_);
    else if (type_ == "click_move_news") this.move_news(val_);
    else if (type_ == "click_news_preshow") Action_details_news(this.news_flag);
    else if (type_ == "click_double_preshow")
      Content.DetailsCallbackNamespace.Make_double_apply_popup(val_);
    else if (type_ == "click_content_preshow")
      Content.DetailsCallbackNamespace.Req_details_qa(
        "/search/req_search_details",
        val_,
        "content"
      );
  }
  move_page_button(type_) {
    if (type_ == 11) this.props.page_move(11, "Q/A", false);
    else if (type_ == 1) this.props.page_move(1, "복대리", false);
    //else if (type_ == 9) this.props.page_move(9, "News", false);
  }
  move_news(direction_) {
    if (direction_ == 1 && this.news_length - 1 > this.news_flag) {
      this.state.radio_class[this.news_flag] = "radio_style1";
      this.news_flag += 1;
    } else if (direction_ == 0 && this.news_flag > 0) {
      this.state.radio_class[this.news_flag] = "radio_style1";
      this.news_flag -= 1;
    } else return;
    this.state.radio_class[this.news_flag] = "radio_style1_click";
    this.state.news_img = DataInfo.get_page_memmory("news")[this.news_flag].img;
    this.state.news_text1 =
      DataInfo.get_page_memmory("news")[this.news_flag].date;
    this.state.news_text2 =
      DataInfo.get_page_memmory("news")[this.news_flag].title;
    this.state.news_text3 =
      DataInfo.get_page_memmory("news")[this.news_flag].proponent;
    this.state.radio_ele_ = this.state.radio_class.map((val_, index_) => {
      return React.createElement("div", { key: index_, className: val_ });
    });
    this.setState(this.state);
  }
  Action_details_news() {
    var num_; //= DataInfo.--> 마무리 필요
    var from_server_ = [
      "/bucket/cardnews3.png",
      "/bucket/cardnews3_1.png",
      "/bucket/cardnews3_2.png",
      "/bucket/cardnews3_3.png",
      "/bucket/cardnews3_4.png",
      "/bucket/cardnews3_5.png",
      "/bucket/cardnews3_6.png",
      "/bucket/cardnews3_7.png",
    ];
    var preshow_data_ = Util_.find_data_from_dataSource(
      DataInfo.get_page_memmory("ResArr"),
      num_
    );
    var cardnews_ = Make_cardnews_details(from_server_, preshow_data_);
    var additional_ =
      Content.DetailsPageNamespace.Make_content_details_additional(
        preshow_data_.sub_count,
        preshow_data_.comment_count,
        preshow_data_.view_count,
        preshow_data_.date,
        0
      );
    var content_ = Content.Details_page_template(
      null,
      preshow_data_.title,
      cardnews_,
      additional_,
      Content.CreateContentComment([], num_, {
        revise_comment: "/news/req_revise_comment",
        write_comment: "/news/req_write_comment",
        sub_comment: "/news/req_sub_scrap",
      })
    );
    Fullscreen.Create_fullscreen(content_);
  }

  make_preshow_content(type_, data_) {
    var a = null;
    var b = null;
    if (type_ == "double") {
      const double_preshow_ = data_.map((val_, index_) => {
        a = Content.PreshowNamespace.Make_preshow_double_category(
          val_[Util_.dbdi("date_d")],
          val_[Util_.dbdi("is_comment")],
          val_[Util_.dbdi("cate")]
        );
        b = Content.PreshowNamespace.Make_preshow_double_content(
          val_[Util_.dbdi("place")],
          val_[Util_.dbdi("date_d")],
          val_[Util_.dbdi("cost")]
        );
        return React.createElement(
          "div",
          {
            onClick: this.event_home_page.bind(
              this,
              "click_double_preshow",
              val_.num
            ),
          },
          Content.Content_preshow_template(a, null, b, null, null)
        );
      });
      return double_preshow_;
    } else if (type_ == "content") {
      const content_preshow_ = data_.map((val_, index_) => {
        a = Content.PreshowNamespace.Make_preshow_content_category([
          val_[Util_.dbdi("cate1")],
          val_[Util_.dbdi("cate2")],
          val_[Util_.dbdi("cate3")],
        ]);
        b = val_[Util_.dbdi("title")];
        return React.createElement(
          "div",
          {
            onClick: this.event_home_page.bind(
              this,
              "click_content_preshow",
              val_.num
            ),
          },
          Content.Content_preshow_template(a, b, null, null, null)
        );
      });
      return content_preshow_;
    } else if (type_ == "news") {
      this.news_length = data_.length;
      const radio_ele_ = data_.map((val_, index_) => {
        this.state.radio_class.push(
          index_ == 0 ? "radio_style1_click" : "radio_style1"
        );
        return React.createElement("div", {
          key: index_,
          className: this.state.radio_class[index_],
        });
      });
      return radio_ele_;
    } else
      return React.createElement(
        "div",
        null,
        "오류가 발생했습니다, 어플을 다시 시작해주세요"
      );
  }

  async get_data_from_server() {
    //유효성 검사
    var mesg_ = await check_form_get_data({
      place: DataInfo.return_user_num("PLACE"),
    });
    if (!mesg_.success) {
      Popup.Create_popup(null, mesg_.message, "창닫기");
      return;
    }

    var from_server_ = await Util_.cli_to_server(
      "/homepage/get_data",
      { place: DataInfo.return_user_num("PLACE") },
      "POST"
    );
    if (!from_server_.success) {
      Popup.Create_popup(
        null,
        Util_.text_with_newline("서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요."),
        "창닫기"
      );
      return;
    }
    this.state.content_ele_ = this.make_preshow_content(
      "content",
      from_server_.message.content
    );
    this.state.double_ele_ = this.make_preshow_content(
      "double",
      from_server_.message.double
    );
    this.state.radio_ele_ = this.make_preshow_content("news", NewsData);

    this.state.news_img = NewsData[0].img;
    this.state.news_text1 = NewsData[0].date;
    this.state.news_text2 = NewsData[0].title;
    this.state.news_text3 = NewsData[0].proponent;
    this.setState(this.state);
    DataInfo.set_page_value("content", from_server_.message.content);
    DataInfo.set_page_value("double", from_server_.message.double);
  }
  componentDidMount() {
    if (DataInfo.return_page_num() != 8) {
      console.log("not page 8, re init");
      this.props.page_move(8, "Home", false, false);
    }
    DataInfo.init_page_memory({
      content: null,
      double: null,
      ShowingContent: null,
      SelectedCategory: { index: null, selector: Util_.dbdi("num") },
      ShowingContentNum: null,
      DataSource: "content",
      RENEW: this.get_data_from_server.bind(this),
    });
    this.get_data_from_server();

    window.parent.postMessage("https://www.instagram.com/lawy_land");
  }
  render() {
    return React.createElement(
      "div",
      { id: "homepage_mid" },
      React.createElement(
        "div",
        { className: "homepage_container" },
        React.createElement(
          "div",
          {
            id: "homepage_news_container",
          },
          React.createElement("img", { id: "cardnews_back" }), //this.state.news_img}),
          React.createElement(
            "div",
            { style: { position: "relative" } },
            React.createElement(
              "div",
              {
                id: "cardnews_header",
                className: "normal_text",
              },
              React.createElement(
                "div",
                { className: "cardnews_title inline_container" },
                React.createElement("img", {
                  src: lawreport_img,
                  className: "cardnews_logo",
                }),
                //React.createElement("div",{className:"cardnews_logo"},"Law리포터"),
                React.createElement(
                  "div",
                  {
                    onClick: this.event_home_page.bind(
                      this,
                      "click_page_move",
                      9
                    ),
                    className: "cardnews_href place_right",
                  },
                  React.createElement("img", { src: move_yellow_img })
                )
              ),
              React.createElement(
                "div",
                { id: "cardnews_content" },
                React.createElement("div", null, this.state.news_text1),
                React.createElement("div", null, this.state.news_text2),
                React.createElement("div", null, this.state.news_text3)
              )
            ),
            React.createElement(
              "div",
              { className: "cardnews_move inline_container" },
              React.createElement(
                "div",
                {
                  onClick: this.event_home_page.bind(
                    this,
                    "click_move_news",
                    0
                  ),
                  className: "cardnews_button",
                },
                React.createElement("img", {
                  src: lefticon_img,
                })
              ),
              React.createElement(
                "div",
                {
                  onClick: this.event_home_page.bind(
                    this,
                    "click_move_news",
                    1
                  ),
                  className: "place_right cardnews_button",
                },
                React.createElement("img", {
                  src: righticon_img,
                })
              )
            ),
            React.createElement(
              "div",
              { className: "cardnews_radio inline_container" },
              this.state.radio_ele_
            ),
            React.createElement(
              "div",
              {className:"button_style2 place_right", onClick:this.open_menu},
              "전문 보기"
              ),
              this.state.is_menu_open ? React.createElement(
                "div",
                {className: "menu"},
                  <button 
                      className='instargram'
                      onClick={() => navigator.clipboard.writeText('https://www.instagram.com/p/CP7gk7NMY5k/')}>
                      https://www.instagram.com/p/CP7gk7NMY5k/</button>,
                      React.createElement(
                        "img",
                        {
                          className: "copy_img",
                          src: copy_img
                        }
                      )
                ):null,
          )
        )
      ),
      React.createElement(
        "div",
        {
          id: "homepage_qa_container",
          className: "homepage_container padding_content_obj",
        },
        React.createElement(
          "div",
          {
            className: "home_container_title_text inline_container normal_text",
          },
          React.createElement("div", null, "최신 Q/A"),
          React.createElement("img", {
            src: move_black_img,
            onClick: this.event_home_page.bind(this, "click_page_move", 11),
            className: "place_right1",
          })
        ),
        this.state.content_ele_
      ),
      React.createElement("div", { className: "border_style1" }),
      React.createElement(
        "div",
        {
          id: "homepage_double_container",
          className: "homepage_container padding_content_obj",
        },
        React.createElement(
          "div",
          {
            className: "home_container_title_text inline_container normal_text",
          },
          React.createElement(
            "div",
            null,
            '"' + DataInfo.return_user_num("NAME") + '"변호사님 주변 복대리'
          ),
          React.createElement("img", {
            src: move_black_img,
            onClick: this.event_home_page.bind(this, "click_page_move", 1),
            className: "place_right1",
          })
        ),
        this.state.double_ele_
      )
    );
  }
}

export default withRouter(Home);
