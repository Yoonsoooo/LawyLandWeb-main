import React from "react";
import Util_ from "./class/GlobalFtn";
import Popup from "./class/Popup";
import Content from "./class/Content";
import { MakeContentList } from "./class/ContentList";
import "../stylesheets/search.css";
import check from "./class/CheckForm";

import write_img from "../images/writeicon.png";
import search_img from "../images/findicon.png";

import { withRouter } from "react-router-dom";

async function check_form_req_search_preshow(data_) {
  if (!check.isContentOrDouble(data_.type)) {
    return { success: false, message: "잘못된 type 입니다" };
  }
  if (!check.isString(data_.input)) {
    return { success: false, message: "잘못된 input 입니다" };
  }
  if (!check.isNumberRange(data_.category, 60)) {
    return { success: false, message: "잘못된 category 입니다" };
  }
  if (!check.isNumberRange(data_.sort, 2)) {
    return { success: false, message: "잘못된 sort 입니다" };
  }
  if (!check.isMinNumberRange(data_.offset, -1)) {
    return { success: false, message: "잘못된 offset 입니다" };
  }

  return { success: true, message: null };
}

function SearchPreshow(index_, val_) {
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    Make_search_preshow_controller(index_, clicked_num_, button_text_, block_) {
      var button_ele = block_
        ? React.createElement(
            "div",
            {
              className:
                "search_preshow_controller_button normal_text place_right",
            },
            button_text_
          )
        : React.createElement(
            "div",
            {
              className: "search_preshow_controller_button normal_text",
              onClick: this.Action_click_details_data.bind(
                this,
                index_,
                clicked_num_
              ),
            },
            button_text_
          );
      return React.createElement(
        "div",
        { className: "search_preshow_controller inline_container" },
        button_ele
      );
    }

    async Action_click_details_data(index_, num_) {
      //isClick();
      if (index_ == 0) {
        Content.DetailsCallbackNamespace.Req_details_qa(
          `/search/req_search_details`,
          num_
        );
      } else if (index_ == 3)
        Content.DetailsCallbackNamespace.Make_double_apply_popup(num_);
    }
    render() {
      var selector_ = DataInfo.get_page_memmory("SelectedCategory")["index"];
      if (selector_ == 0) {
        var temp_ = Content.PreshowNamespace.Create_preshow_content(val_);
        var button_text = "전문 보기";
        var block_ = false;
      } else if (selector_ == 3) {
        var temp_ = Content.PreshowNamespace.Create_preshow_double(val_);
        if (val_[Util_.dbdi("is_comment")]) {
          var button_text = "선정완료";
          var block_ = true;
        } else {
          var button_text = "신청하기";
          var block_ = false;
        }
      } else if (selector_ == 1)
        var temp_ = Content.PreshowNamespace.Create_preshow_comment(val_);
      return React.createElement(
        "div",
        { key: index_, className: "search_preshow_area" }, //, onClick:this.Action_click_preshow.bind(this,num_)},
        Content.Content_preshow_template(
          temp_[0],
          temp_[1],
          temp_[2],
          temp_[3]
        ),
        this.Make_search_preshow_controller(
          selector_,
          val_[Util_.dbdi("num")],
          button_text,
          block_
        )
      );
      //return Content.Content_preshow_template(temp_[0],temp_[1],temp_[2],temp_[3],
      //    this.Make_search_preshow_controller(selector_, val_[Util_.dbdi('num')], button_text,block_),index_)
    }
  };
}

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search_tool: null,
      input: null,
      text_tool1: null,
      text_tool2: null,
      get_more_data: this.get_more_data.bind(this),
      isClick: this.props.handleUpdateClick.bind(this),
    };

    this.sendData = {
      type: "content",
      input: "",
      category: 0,
      sort: 0,
      offset: 0,
    };
  }
  reset_sendData() {
    this.sendData.input = "";
    this.sendData.category = 0;
    this.sendData.sort = 0;
    this.sendData.offset = 0;
  }

  async get_more_data() {
    var mesg_ = await check_form_req_search_preshow({
      type: this.sendData.type,
      input: this.sendData.input,
      category: this.sendData.category,
      sort: this.sendData.sort,
      offset: this.sendData.offset,
    });
    if (!mesg_.success) {
      Popup.Create_popup(null, mesg_.message, "창닫기");
      return false;
    }

    var from_server_ = await Util_.cli_to_server(
      "/search/req_search_preshow",
      this.sendData,
      "POST"
    );
    if (!from_server_.success) return false;
    DataInfo.set_page_value(
      "ResArr",
      DataInfo.get_page_memmory("ResArr").concat(from_server_.message)
    );
    this.sendData.offset = this.sendData.offset + from_server_.message.length;
    return from_server_.message.length === 0 ? 1 : from_server_.message.length;
  }
  async get_search_from_server() {
    try {
      this.sendData.sort = this.sendData.sort ? this.sendData.sort : 0;
      this.sendData.category = this.sendData.category
        ? this.sendData.category
        : 0;
      this.sendData.input = this.state.input ? this.state.input : "";
      this.sendData.offset = 0;
      var mesg_ = await check_form_req_search_preshow({
        type: this.sendData.type,
        input: this.sendData.input,
        category: this.sendData.category,
        sort: this.sendData.sort,
        offset: this.sendData.offset,
      });
      if (!mesg_.success) {
        Popup.Create_popup(null, mesg_.message, "창닫기");
        return;
      }
      var from_server_ = await Util_.cli_to_server(
        "/search/req_search_preshow",
        this.sendData,
        "POST"
      );
      if (!from_server_.success) {
        Util_.make_element("div", "search_mid", null, from_server_.message);
        return false;
      }
      this.sendData.offset += from_server_.message.length;
      DataInfo.set_page_value("ResArr", from_server_.message);
      Util_.make_element(
        MakeContentList(this.state, SearchPreshow),
        "search_mid"
      );
      return from_server_.message.length;
    } catch (err) {
      Util_.make_element(
        "div",
        "search_mid",
        null,
        "클라이언트 error: 서버와 통신에 실패하였습니다"
      );
      return false;
    }
  }
  event_search_page(type_, val1_, e) {
    if (type_ == "click_write") {
      if (DataInfo.return_page_num() === 11) {
        this.props.page_move(6, "Q/A 작성", false);
      } else if (DataInfo.return_page_num() === 1)
        this.props.page_move(7, "복대리 작성", false); //DataInfo.page_move(7,false,'/write_double_agent')
    } else if (type_ === "select_category") this.action_search_category(val1_);
    else if (type_ === "click_search") this.get_search_from_server();
  }
  change_search_state(column_, val_) {
    if (typeof val_ === "object") this.state[column_] = val_.target.value;
    else this.state[column_] = val_;
    this.setState(this.state);
  }

  action_search_category(category_) {
    if (category_ === 1) {
      Popup.Create_popup(
        "분야 선택",
        "category",
        "취소",
        "선택",
        this.action_add_condition_category.bind(this),
        { max: 1, init_state: [this.sendData.category], start_index: 0 }
      ); //this.action_add_condition_category)
    } else if (category_ === 2)
      Popup.Create_popup(
        "지역 선택",
        "place",
        "취소",
        "선택",
        this.action_add_condition_place.bind(this),
        { max: 1, init_state: [this.sendData.category], start_index: 0 }
      );
    else if (category_ === 3)
      Popup.Create_popup("정렬 기준", this.popup_content_sort(), "취소");
  }

  action_add_condition_category(data_) {
    this.sendData.category =
      data_.popup_data.length !== 0 ? data_.popup_data[0] : 0;
    this.change_search_state(
      "text_tool1",
      "+" + Util_.category_to_string("category_qa", this.sendData.category)
    );
    this.get_search_from_server();
    Popup.Action_cancel_button();
  }
  action_add_condition_place(data_) {
    this.sendData.category =
      data_.popup_data.length !== 0 ? data_.popup_data[0] : 0;
    this.change_search_state(
      "text_tool1",
      "+" + Util_.category_to_string("place", this.sendData.category)
    );
    Popup.Action_cancel_button();
    this.get_search_from_server();
  }
  popup_content_sort() {
    function action_add_condition_sort(type_, e) {
      this.sendData.sort = type_ ? type_ : 0;
      var temp_ = ["최신순", "답변수", "조회수"];
      this.change_search_state("text_tool2", "+" + temp_[this.sendData.sort]);
      Popup.Action_cancel_button();
      this.get_search_from_server();
    }
    return React.createElement(
      "div",
      { id: "sort_menu" },
      React.createElement(
        "div",
        {
          className: "sort_category",
          onClick: action_add_condition_sort.bind(this, 0),
        },
        "최신순"
      ),
      React.createElement(
        "div",
        {
          className: "sort_category",
          onClick: action_add_condition_sort.bind(this, 1),
        },
        "답변수"
      ),
      React.createElement(
        "div",
        {
          className: "sort_category",
          onClick: action_add_condition_sort.bind(this, 2),
        },
        "조회수"
      )
    );
  }

  make_content_search_tool() {
    return React.createElement(
      "div",
      { id: "search_tool_list", className: "inline_container normal_text" },
      React.createElement(
        "label",
        { className: "search_category" },
        React.createElement("img", { src: write_img }),
        React.createElement(
          "div",
          { onClick: this.event_search_page.bind(this, "click_write") },
          "글쓰기"
        )
      ),
      React.createElement(
        "div",
        {
          id: "category",
          className: "search_category",
          onClick: this.event_search_page.bind(this, "select_category", 1),
        },
        this.state.text_tool1
      ),
      React.createElement(
        "div",
        {
          id: "sort",
          className: "search_category",
          onClick: this.event_search_page.bind(this, "select_category", 3),
        },
        this.state.text_tool2
      )
    );
  }
  make_double_search_tool() {
    return React.createElement(
      "div",
      { id: "search_tool_list", className: "inline_container normal_text" },
      React.createElement(
        "label",
        { className: "search_category" },
        React.createElement("img", { src: write_img }),
        React.createElement(
          "div",
          { onClick: this.event_search_page.bind(this, "click_write") },
          "글쓰기"
        )
      ),
      React.createElement(
        "div",
        {
          id: "category",
          className: "search_category",
          onClick: this.event_search_page.bind(this, "select_category", 2),
        },
        this.state.text_tool1
      )
    );
  }
  create_search_tool() {
    if (DataInfo.return_page_num() == 11)
      return this.make_content_search_tool();
    else if (DataInfo.return_page_num() == 1)
      return this.make_double_search_tool();
    else return;
  }
  componentDidMount() {
    this.reset_sendData();
    //if(DataInfo.return_page_num()==0){

    if (DataInfo.return_page_num() == 11) {
      this.sendData.type = "content";
      this.change_search_state("text_tool1", "+전체 분야");
      this.change_search_state("text_tool2", "+최신순");
    } else if (DataInfo.return_page_num() == 1) {
      this.sendData.type = "double";
      this.change_search_state("text_tool1", "+전체 지역");
    } else {
      this.props.page_move(11, "Q/A", false);
      this.sendData.type = "content";
      this.change_search_state("text_tool1", "+전체 분야");
      this.change_search_state("text_tool2", "+최신순");
    }

    DataInfo.init_page_memory({
      ResArr: null,
      ShowingPage: { now: 0, end: null },
      ShowingContent: null,
      ShowingContentNum: null,
      SelectedCategory: {
        index: DataInfo.return_page_num() == 11 ? 0 : 3,
        selector: Util_.dbdi("num"),
      },
      DataSource: "ResArr",
      RENEW: this.get_search_from_server.bind(this),
    });
    this.get_search_from_server();
  }
  render() {
    return (
      <div>
        <div id="search_top">
          <div id="search_top_top">
            <div
              id="search_box_container"
              className=" inline_container input_style2"
            >
              <input
                type="text"
                id="search_confirm_data"
                placeholder={
                  DataInfo.return_page_num() == 11 ? "검색창" : "장소(ex 법원)"
                }
                value={this.state.input}
                onChange={this.change_search_state.bind(this, "input")}
              ></input>
              <img
                id="req_search_button"
                src={search_img}
                onClick={this.event_search_page.bind(
                  this,
                  "click_search",
                  null
                )}
              ></img>
            </div>
          </div>
          <div id="search_top_mid"> {this.create_search_tool()} </div>
        </div>
        <div id="search_mid"></div>
      </div>
    );
  }
}

export default withRouter(Search);
