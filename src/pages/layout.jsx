import React, { Fragment } from "react";
import "../stylesheets/layout.css";
import { Route, Switch, Redirect } from "react-router-dom";
import Util_ from "./class/GlobalFtn";
import {
  Home,
  Search,
  Write,
  Repository,
  Change_userinfo,
  News,
  Write_double,
  About,
  ServiceCenter,
  ViewResults,
} from "./index.async.jsx";
import Popup from "./class/Popup";
import Fullscreen from "./class/Fullscreen";

import arrow_img from "../images/arrowicon.png";
import menu_img from "../images/menuicon.png";
import logo_img from "../images/logoicon1.png";
import user_img from "../images/balancescale.png";
import closeback_img from "../images/closeback.png";
import close_img from "../images/close.png";

import { withRouter } from "react-router-dom";

function _START_APP() {
  if (typeof window.DataInfo == "undefined") {
    window.DataInfo = {
      PAGEOBJNAME: {
        11: "Search_qa",
        1: "Search_double",
        2: "About",
        3: "Service_center",
        4: "Change_userinfo",
        5: "Repository",
        6: "Write",
        7: "Writedouble",
        8: "Home",
        9: "News",
        10: "View_results",
      },
      SECUREINFO: {
        CARD: null,
        UID: null,
      },
      PAGEINFO: {
        PAGENUM: null,
        BEFOTRPAGENUM: null,
      },
      Public_memmory: {
        USERINFO: { NUM: null, NAME: null, PLACE: null, FIELD: null },
        TEMP: null,
        Authentication: 0,
      },
      Page_memmory: {},
      return_user_num: function (val_ = null) {
        if (!val_) return this.Public_memmory.USERINFO.NUM;
        else return this.Public_memmory.USERINFO[val_];
      },
      set_userinfo_init: function () {
        if (this.Public_memmory.USERINFO.NUM) return;
        if (!sessionStorage.getItem("user"))
          return Popup.Create_popup(
            null,
            Util_.text_with_newline("로그인 정보가 소멸됐습니다.\n 로이랜드를 다시 시작해 주세요."),
            "창닫기"
          );
        let data_ = JSON.parse(sessionStorage.getItem("user"));
        this.Public_memmory.USERINFO.NUM = data_.user;
        this.Public_memmory.USERINFO.FIELD = data_.field;
        this.Public_memmory.USERINFO.NAME = data_.name;
        this.Public_memmory.USERINFO.ACQUISITION = data_.acquisition;
        this.Public_memmory.USERINFO.PLACE = data_.place;
        this.SECUREINFO.CARD = data_.light_card;
        this.SECUREINFO.UID = data_.uid;
      },
      delete_userinfo: function () {
        this.Public_memmory.USERINFO.NUM = null;
        this.Public_memmory.USERINFO.FIELD = null;
        this.Public_memmory.USERINFO.NAME = null;
        this.Public_memmory.USERINFO.ACQUISITION = null;
        this.Public_memmory.USERINFO.PLACE = null;
      },
      delete_page_memmory: async function (flag_ = false) {
        if (flag_) {
          delete this.Page_memmory[this.return_page_num];
        } else {
          var page_keys_ = Object.keys(this.Page_memmory);
          page_keys_.forEach((val_) => {
            delete this.Page_memmory[page_keys_];
          });
        }
      },
      init_page_memory: function (obj_) {
        if (!this.return_user_num()) this.set_userinfo_init();
        if (this.Page_memmory[this.PAGEOBJNAME[this.PAGEINFO.PAGENUM]]) return;
        else {
          if (this.PAGEOBJNAME[this.PAGEINFO.PAGENUM])
            this.Page_memmory[this.PAGEOBJNAME[this.PAGEINFO.PAGENUM]] = obj_;
          else
            Popup.Create_popup(
              null,
              Util_.text_with_newline("잘못된 페이지 이동입니다.\n 다시 접속해 주세요."),
              "창닫기"
            );
        }
      },
      return_page_num: function (val_ = false) {
        if (val_) {
          this.PAGEINFO.PAGENUM = val_;
        } else return this.PAGEINFO.PAGENUM;
      },
      return_before_page_num: function (delete_ = false) {
        if (delete_) {
          //true면 이전페이지 삭제 후 반환
          var temp_ = this.PAGEINFO.BEFOREPAGENUM;
          this.PAGEINFO.BEFOREPAGENUM = null;
          return temp_;
        } else return this.PAGEINFO.BEFOREPAGENUM;
      },
      get_page_memmory: function (obj_val_name_ = false) {
        if (obj_val_name_)
          return this.Page_memmory[this.PAGEOBJNAME[this.PAGEINFO.PAGENUM]][
            obj_val_name_
          ];
        else return this.Page_memmory[this.PAGEOBJNAME[this.PAGEINFO.PAGENUM]];
      },
      collect_public_memmory: function () {
        delete this.Public_memmory.TEMP;
        this.Public_memmory.TEMP = null;
      },
      set_page_value: function (obj_val_name_, val_) {
        this.Page_memmory[this.PAGEOBJNAME[this.PAGEINFO.PAGENUM]][
          obj_val_name_
        ] = val_;
      },
      inc_page_value: function (obj_val_name_) {
        this.Page_memmory[this.PAGEOBJNAME[this.PAGEINFO.PAGENUM]][
          obj_val_name_
        ] += 1;
      },
      get_public_memmory: function (obj_val_name_ = false) {
        if (obj_val_name_) return this.Public_memmory.TEMP[obj_val_name_];
        else return this.Public_memmory.TEMP;
      },
      set_public_value: function (val_) {
        this.Public_memmory.TEMP = val_;
      },
      get_showing_content: function (val_name_ = null) {
        return val_name_
          ? this.Page_memmory[this.PAGEOBJNAME[this.PAGEINFO.PAGENUM]][
              "ShowingContent"
            ][val_name_]
          : this.Page_memmory[this.PAGEOBJNAME[this.PAGEINFO.PAGENUM]][
              "ShowingContent"
            ];
      },
      set_showing_content: function (val_name_, val_) {
        this.Page_memmory[this.PAGEOBJNAME[this.PAGEINFO.PAGENUM]][
          "ShowingContent"
        ][val_name_] = val_;
      },
      inc_showing_content: function (val_name_) {
        this.Page_memmory[this.PAGEOBJNAME[this.PAGEINFO.PAGENUM]][
          "ShowingContent"
        ][val_name_] += 1;
      },
      dec_showing_content: function (val_name_) {
        this.Page_memmory[this.PAGEOBJNAME[this.PAGEINFO.PAGENUM]][
          "ShowingContent"
        ][val_name_] -= 1;
      },
    };
  }
}

class Layout extends React.Component {
  constructor(props) {
    super(props);
    _START_APP();
    this.state = {
      usermenu_class: "glass_black hide_usermenu",
      change_layout_title: this.change_layout_title.bind(this),
      layout_top_title: "Home",
      layout_icon_path: "/images/logoicon1.png",
      layout_icon_callback: null,
      layout_top_class: "layout_top_default inline_container",
      page_move: this.page_move.bind(this),
      isClick: false,
    };
    //"/images/closeback.png"
    //page move 관련 -> backbone
    this.handleUpdateClick = this.handleUpdateClick.bind(this);
    this.handleUpdateFalseClick = this.handleUpdateFalseClick.bind(this);
    this.Logout_callback = this.Logout_callback.bind(this);
  }

  handleUpdateClick() {
    this.setState(
      {
        isClick: true,
      }
    );
  }

  handleUpdateFalseClick() {
    this.setState(
      {
        isClick: false,
      }
    );
  }

  //------------------------------------ move page
  async page_move(page_num_, layout_title_, remain_, reset_url_flag_ = true) {
    if (DataInfo.return_page_num() === page_num_) {
      if (this.state.usermenu_class != "glass_black hide_usermenu")
        this.change_usermenu_state();
      return;
    }
    let url_list_ = [
      null,
      "/search_double",
      "/about",
      "/service_center",
      "/change_userinfo",
      "/repository",
      "/write",
      "/write_double_agent",
      "/home",
      "/news",
      "/view_results",
      "/search_qa",
    ];
    if (remain_) {
      DataInfo.PAGEINFO.BEFOREPAGENUM = DataInfo.return_page_num();
      DataInfo.return_page_num(page_num_);
    } else {
      DataInfo.collect_public_memmory();

      if (page_num_ === "before" && DataInfo.return_before_page_num()) {
        DataInfo.delete_page_memmory(true);
        DataInfo.return_page_num(DataInfo.return_before_page_num(true));
      } else {
        DataInfo.delete_page_memmory();
        DataInfo.return_page_num(page_num_);
      }
    }
    Popup.Action_cancel_button();
    Fullscreen.Action_cancel_button();
    if (reset_url_flag_)
      this.props.history.push(
        "/homepage" + url_list_[DataInfo.return_page_num()]
      );

    this.change_layout_title(layout_title_);
    if (this.state.usermenu_class != "glass_black hide_usermenu")
      this.change_usermenu_state();
  }
  //------------------------------------

  //------------------------------------
  change_layout_title(title_text_) {
    if (title_text_ == "fullscreen") {
      this.state.layout_top_class = "layout_top_fullscreen";
      this.state.layout_icon_path = "/images/closeback.png";
      this.state.layout_icon_callback = this.Action_cancel_fullscreen;
    } else {
      this.state.layout_top_title = title_text_;
      this.state.layout_top_class = "layout_top_default inline_container";
    }
    this.setState(this.state);
  }

  change_usermenu_state() {
    if (this.state.usermenu_class == "glass_black hide_usermenu")
      this.state.usermenu_class = "glass_black active_usermenu";
    else this.state.usermenu_class = "glass_black hide_usermenu";
    this.setState(this.state);
  }
  action_layout_top_menu(clicked_ele_) {
    if (clicked_ele_ == "layout_top_menu") {
      Util_.make_element(
        "div",
        "popup_render_place",
        { id: "glass_background", className: "glass_black" },
        this.Create_usermenu()
      );
    } else if ("layout_top_logo") {
      this.page_move(8);
    }
  }

  Action_logout() {
    Popup.Create_popup(
      null,
      "정말 로그아웃 하시겠습니까?",
      "아니요",
      "네",
      this.Logout_callback
    );
  }
  async Logout_callback() {
    //async
    var from_server_ = await Util_.cli_to_server(
      "/homepage/logout",
      { user: DataInfo.return_user_num() },
      "POST"
    );
    if (!from_server_.success) {
      Popup.Create_popup(null, from_server_.message, "창닫기");
      return;
    } else {
      Popup.Create_popup(null, from_server_.message, "창닫기");
      sessionStorage.removeItem("user");
      this.props.history.push("/login");
    }
  }
  Create_usermenu() {
    return (
      <div id="left_menu">
        <div className="left_menu_category inline_container">
          <div onClick={this.change_usermenu_state.bind(this)}>
            <img className="close_img" src={close_img}></img>
          </div>
          <div className="place_right" onClick={this.Action_logout.bind(this)}>
            로그아웃
          </div>
        </div>
        <div id="left_menu_usermenu">
          <div id="left_menu_userinfo" className="inline_container">
            <img className="user_img" src={user_img}></img>
            <div id="userinfo_text" className="normal_text">
              <div> {DataInfo.return_user_num("NAME")} 변호사님</div>
              <div className="date_text_color">{`${
                Util_.category_to_string(
                  "field",
                  DataInfo.return_user_num("FIELD")
                )
                  ? Util_.category_to_string(
                      "field",
                      DataInfo.return_user_num("FIELD")
                    ) + "전문"
                  : ""
              } 변호사  
                                ${
                                  DataInfo.Public_memmory.USERINFO.ACQUISITION
                                }년도에 등록`}</div>
            </div>
          </div>
          <div id="user_page" className="inline_container">
            <div
              className="usermenu_category inline_container"
              onClick={this.page_move.bind(this, 4, "My Page", false)}
            >
              <div>My page</div>
            </div>
            <div
              className="usermenu_category inline_container"
              onClick={this.page_move.bind(this, 5, "나의 이력", false)}
            >
              <div>나의 이력</div>
            </div>
          </div>
        </div>
        <div
          className="left_menu_category inline_container"
          onClick={this.page_move.bind(this, 11, "Q/A", false)}
        >
          <div>Q/A</div>
          <img src={arrow_img}></img>
        </div>
        <div
          className="left_menu_category inline_container"
          onClick={this.page_move.bind(this, 1, "복대리", false)}
        >
          <div>복대리</div>
          <img src={arrow_img}></img>
        </div>
        <div
          className="left_menu_category inline_container"
          onClick={this.page_move.bind(this, 9, "News", false)}
        >
          <div>News</div>
          <img src={arrow_img}></img>
        </div>
        <div
          className="left_menu_category inline_container"
          onClick={this.page_move.bind(this, 3, "고객센터", false)}
        >
          <div>고객센터</div>
          <img src={arrow_img}></img>
        </div>
        <div
          className="left_menu_category inline_container"
          onClick={this.page_move.bind(this, 2, "About 로이랜드", false)}
        >
          <div>About 로이랜드</div>
          <img src={arrow_img}></img>
        </div>
      </div>
    );
  }

  componentDidMount() {
    DataInfo.set_userinfo_init();
    DataInfo.page_move = this.page_move.bind(this);
    DataInfo.handleUpdateClick = this.handleUpdateClick.bind(this);
    DataInfo.handleUpdateFalseClick = this.handleUpdateFalseClick.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.handleUpdateFalseClick();
    }
  }

  componentWillUnmount() {
    DataInfo.delete_userinfo();
  }

  render() {
    return (
      <Fragment>
        <div id="usermenu_render_place">
          <div className={this.state.usermenu_class}>
            {this.Create_usermenu()}
          </div>
        </div>
        <div
          id="layout_top"
          className={
            this.state.isClick
              ? `layout_top_fullscreen inline_container`
              : this.state.layout_top_class
          }
        >
          {this.state.isClick ? (
            <div className="layout_top_container">
              <img
                className="layout_top_logo"
                src={closeback_img}
                onClick={() => {
                  Fullscreen.Action_cancel_button();
                  this.handleUpdateFalseClick();
                }}
              ></img>
            </div>
          ) : (
            <div className="layout_top_container">
              <img
                className="layout_top_logo"
                src={logo_img}
                onClick={this.page_move.bind(this, 8, "Home", false)}
              ></img>
            </div>
          )}
          {this.state.layout_top_title === "결과통지서 작성" ? (
            <div
              id="layout_title"
              className="layout_top_container middle_large normal_text"
            >
              {this.state.layout_top_title}
            </div>
          ) : (
            <div id="layout_title" className="layout_top_container normal_text">
              {this.state.layout_top_title}
            </div>
          )}
          {this.state.layout_top_title === "결과통지서 작성" ? (
            <div
              className="layout_top_container side_navbar"
              onClick={this.change_usermenu_state.bind(this)}
            >
              <img className="layout_top_menu place_right" src={menu_img}></img>
            </div>
          ) : (
            <div
              className="layout_top_container"
              onClick={this.change_usermenu_state.bind(this)}
            >
              <img className="layout_top_menu place_right" src={menu_img}></img>
            </div>
          )}
        </div>
        <div id="popup_render_place"></div>
        <div id="fullscreen_render_place"></div>
        <div
          id="layout_mid"
          style={
            this.state.isClick ? { display: "none" } : { display: "block" }
          }
        >
          <Switch>
            <Route
              path="/homepage/home"
              render={() =>
                sessionStorage.getItem("user") ? (
                  <Home
                    set_title={this.state.change_layout_title}
                    page_move={this.state.page_move}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                    }}
                  />
                )
              }
            />
            <Route
              path="/homepage/write"
              render={() =>
                sessionStorage.getItem("user") ? (
                  <Write
                    set_title={this.state.change_layout_title}
                    page_move={this.state.page_move}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                    }}
                  />
                )
              }
            />
            <Route
              path="/homepage/write_double_agent"
              render={() =>
                sessionStorage.getItem("user") ? (
                  <Write_double
                    set_title={this.state.change_layout_title}
                    page_move={this.state.page_move}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                    }}
                  />
                )
              }
            />
            <Route
              path="/homepage/change_userinfo"
              render={() =>
                sessionStorage.getItem("user") ? (
                  <Change_userinfo
                    set_title={this.state.change_layout_title}
                    page_move={this.state.page_move}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                    }}
                  />
                )
              }
            />
            <Route
              path="/homepage/search_qa"
              key="search_qa"
              render={() =>
                sessionStorage.getItem("user") ? (
                  <Search
                    handleUpdateClick={this.handleUpdateClick}
                    set_title={this.state.change_layout_title}
                    page_move={this.state.page_move}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                    }}
                  />
                )
              }
            />
            <Route
              path="/homepage/search_double"
              key="search_double"
              render={() =>
                sessionStorage.getItem("user") ? (
                  <Search
                    handleUpdateClick={this.handleUpdateClick}
                    set_title={this.state.change_layout_title}
                    page_move={this.state.page_move}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                    }}
                  />
                )
              }
            />
            <Route
              path="/homepage/repository"
              render={() =>
                sessionStorage.getItem("user") ? (
                  <Repository
                    set_title={this.state.change_layout_title}
                    page_move={this.state.page_move}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                    }}
                  />
                )
              }
            />
            <Route
              path="/homepage/service_center"
              render={() =>
                sessionStorage.getItem("user") ? (
                  <ServiceCenter
                    set_title={this.state.change_layout_title}
                    page_move={this.state.page_move}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                    }}
                  />
                )
              }
            />
            <Route
              path="/homepage/news"
              render={() =>
                sessionStorage.getItem("user") ? (
                  <News
                    handleUpdateClick={this.handleUpdateClick}
                    set_title={this.state.change_layout_title}
                    page_move={this.state.page_move}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                    }}
                  />
                )
              }
            />
            <Route
              path="/homepage/about"
              render={() =>
                sessionStorage.getItem("user") ? (
                  <About
                    set_title={this.state.change_layout_title}
                    page_move={this.state.page_move}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                    }}
                  />
                )
              }
            />
            <Route
              path="/homepage/view_results"
              render={() =>
                sessionStorage.getItem("user") ? (
                  <ViewResults
                    set_title={this.state.change_layout_title}
                    page_move={this.state.page_move}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                    }}
                  />
                )
              }
            />
          </Switch>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Layout);
