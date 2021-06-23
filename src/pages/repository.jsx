import React, { Fragment } from "react";
import "../stylesheets/layout.css";
import "../stylesheets/repository.css";
import Util_ from "./class/GlobalFtn";
import Content from "./class/Content";
import { MakeContentList } from "./class/ContentList";
import Popup from "./class/Popup";
import Fullscreen from "./class/Fullscreen";
import check from "./class/CheckForm";

import { withRouter } from "react-router-dom";

async function check_form_req_repository_preshow(data_) {
  if (data_.type === "content" || data_.type === "double") {
    return { success: false, message: "잘못된 type 입니다" };
  }
  if (!check.isMinNumberRange(data_.offset, -1)) {
    return { success: false, message: "잘못된 offset 입니다" };
  }

  return { success: true, message: null };
}

async function check_form_req_repository_details(data_) {
  if (!(data_.type === "content" || data_.type === "double")) {
    return { success: false, message: "잘못된 type 입니다" };
  }
  if (!check.isMinNumberRange(data_.num, -1)) {
    return { success: false, message: "잘못된 offset 입니다" };
  }

  return { success: true, message: null };
}

async function check_form_req_double_report(data_) {
  if (!check.isNumberInteger(data_.num)) {
    return { success: false, message: "잘못된 num 입니다" };
  }

  return { success: true, message: null };
}

function Revise_comment(clicked_num_, content_, anonymous_) {
  class Popup_content_revise_comment extends React.Component {
    constructor(props) {
      super(props);
      this.state = { anonymous: anonymous_ ? true : false, content: content_ };
      this.result = {
        num: clicked_num_,
        anonymous: anonymous_ ? true : false,
        content: content_,
      };
      console.log(clicked_num_, content_, anonymous_);
    }
    Change_state(type, e) {
      console.log(type);
      console.log(e.target.checked);
      if (type == "anonymous") {
        this.result.anonymous = e.target.checked;
        this.setState({ anonymous: e.target.checked });
      } else if (type == "content") {
        this.result.content = e.target.value;
        this.setState({ content: e.target.value });
      }
      console.log(this.result);
      this.props.set_state("popup_data", this.result);
    }
    componentDidMount() {
      this.props.set_state("popup_data", this.result);
    }
    render() {
      return (
        <Fragment>
          <input
            type="text"
            className="comment_input_box  confirm_comment_data"
            onChange={this.Change_state.bind(this, "content")}
            value={this.state.content}
          />
          <label>
            <input
              type="checkbox"
              className="confirm_comment_data"
              onChange={this.Change_state.bind(this, "anonymous")}
              checked={this.state.anonymous}
            />
            <span>익명 답변</span>
          </label>
        </Fragment>
      );
    }
  }
  async function send_to_server(data_) {
    var to_server_ = {
      type: "comment",
      num: data_.popup_data.num,
      user: DataInfo.return_user_num(),
      anonymous: data_.popup_data.anonymous,
      content: data_.popup_data.content,
    };
    var from_server_ = await Util_.cli_to_server(
      "/repository/req_repository_update",
      to_server_,
      "POST"
    );
    if (from_server_.success) {
      console.log(data_);
      var is_changed_ = await Util_.update_data_from_dataSource(
        "ResArr",
        data_.popup_data.num,
        {
          anonymous: data_.popup_data.anonymous,
          content_comment: data_.popup_data.content,
        },
        Util_.dbdi("num_c")
      );
      console.log(DataInfo.get_page_memmory());
      if (is_changed_) DataInfo.get_page_memmory("RENEW")();
    }
    Popup.Create_popup(null, from_server_.message, "창닫기");
  }
  Popup.Create_popup(
    "답글 수정",
    Popup_content_revise_comment,
    "취소",
    "수정",
    send_to_server
  );
}

function ResultsNoti(
  attendee_,
  ofdefense_,
  otherside_,
  dateofnexthearing_,
  otherthing_,
  place_
) {
  return class extends React.Component {
    render() {
      return (
        <div id="results_noti_mid">
          <div id="results_noti">
            <div className="inline_container">
              <h3>복대리 결과</h3>
            </div>
          </div>
          <div className="results_noti_container content_preshow_container">
            <div id="results_noti_place"></div>
            <div className="results_noti_label">참석자</div>
            <div>{attendee_}</div>
          </div>
          <div id="results_noti">
            <div className="inline_container">
              <h3>변론 내용</h3>
            </div>
          </div>
          <div className="results_noti_container content_preshow_container">
            <div className="results_noti_label">재판부</div>
            <div>{ofdefense_}</div>
          </div>
          <div className="results_noti_container content_preshow_container">
            <div className="results_noti_label">상대방측</div>
            <div>{otherside_}</div>
          </div>
          <div className="results_noti_container content_preshow_container">
            <div className="results_noti_label">차회 변론기일</div>
            <div>{Util_.make_date_format(dateofnexthearing_, 1)}</div>
          </div>
          <div className="results_noti_container content_preshow_container">
            <div className="results_noti_label">장소</div>
            <div>{place_}</div>
          </div>
          <div id="results_noti">
            <div className="inline_container">
              <h3>기타 사항</h3>
            </div>
          </div>
          <div className="results_noti_container content_preshow_container">
            <div>{otherthing_}</div>
          </div>
        </div>
      );
    }
  };
}

function RepositoryPreshow(index_, val_) {
  return class extends React.Component {
    Action_click_write_report(num_) {
      var clicked_content_ = Util_.find_data_from_dataSource(
        DataInfo.get_page_memmory("ResArr"),
        num_
      );
      console.log(clicked_content_);
      DataInfo.set_page_value("ShowingContent", clicked_content_);

      DataInfo.Public_memmory.TEMP = {
        num: clicked_content_.num,
        place: clicked_content_[Util_.dbdi("place")],
        category: clicked_content_[Util_.dbdi("cate")],
      };

      DataInfo.page_move(10, "결과통지 작성", true);
    }

    async Req_double_report(num_) {
      // 후에 propa back으로
      var clicked_content_ = Util_.find_data_from_dataSource(
        DataInfo.get_page_memmory("ResArr"),
        num_,
        Util_.dbdi("num")
      );
      if (clicked_content_) {
        //유효성 검사
        var mesg_ = await check_form_req_double_report({
          num: num_,
          user: DataInfo.return_user_num(),
        });

        if (!mesg_.success) {
          Popup.Create_popup(null, mesg_.message, "창닫기");
          return;
        }

        var from_server_ = await Util_.cli_to_server(
          "/repository/req_double_report",
          { num: num_, user: DataInfo.return_user_num() },
          "POST"
        );
        if (from_server_.success) {
          var data_ = from_server_.message[0];
          console.log(data_);
          Fullscreen.Create_fullscreen(
            ResultsNoti(
              data_.attendee,
              data_.ofdefense,
              data_.otherside,
              data_.dateofnexthearing,
              data_.otherthing,
              data_.place
            )
          );
        } else Popup.Create_popup(null, from_server_.message, "창닫기");
      }
    }

    async Revise_content_noDetails(clicked_num_) {
      //유효성검사
      var mesg_ = await check_form_req_repository_details({
        type: "content",
        num: clicked_num_,
        user: DataInfo.return_user_num(),
        for_revise: true,
      });
      if (!mesg_.success) {
        Popup.Create_popup(null, mesg_.message, "창닫기");
        return;
      }

      var from_server_ = await Util_.cli_to_server(
        "/repository/req_repository_details",
        {
          type: "content",
          num: clicked_num_,
          user: DataInfo.return_user_num(),
          for_revise: true,
        },
        "POST"
      );
      if (!from_server_.success) {
        Popup.Create_popup(null, from_server_.message, "창닫기");
        return;
      }
      let clicked_content_ = Util_.find_data_from_dataSource(
        DataInfo.get_page_memmory("ResArr"),
        clicked_num_,
        Util_.dbdi("num")
      );
      from_server_ = from_server_.message;
      Object.assign(clicked_content_, from_server_.details[0]);
      DataInfo.Page_memmory.Repository.ShowingContent.details =
        clicked_content_;
      DataInfo.Page_memmory.Repository.ShowingContent.obj =
        clicked_content_.obj;
      DataInfo.Public_memmory.TEMP = {
        revise: true,
        user: DataInfo.return_user_num(),
        anonymous: clicked_content_[Util_.dbdi("anonymous")],
        category: [
          clicked_content_[Util_.dbdi("cate1")],
          clicked_content_[Util_.dbdi("cate2")],
          clicked_content_[Util_.dbdi("cate3")],
        ],
        title: clicked_content_[Util_.dbdi("title")],
        num: clicked_content_[Util_.dbdi("num")],
        content: clicked_content_[Util_.dbdi("content")],
      };
      DataInfo.page_move(6, "Q/A 수정", true);
    }
    async Action_click_second(num_) {
      var temp_ = Util_.find_data_from_dataSource("ResArr", num_, "num");

      if (!temp_["is_comment"]) {
        Popup.Create_popup(
          null,
          "후속복대리는 매칭된 이후에 신청이 가능합니다.",
          "창닫기"
        );
        return;
      }

      var mesg_ = await check_form_req_repository_details({
        type: "double",
        num: num_,
        user: DataInfo.return_user_num(),
        for_revise: true,
      });

      if (!mesg_.success) {
        Popup.Create_popup(null, mesg_.message, "창닫기");
        return;
      }

      var from_server_ = await Util_.cli_to_server(
        "/repository/req_repository_details",
        {
          type: "double",
          num: num_,
          user: DataInfo.return_user_num(),
          for_revise: true,
        },
        "POST"
      );
      if (!from_server_.success) {
        Popup.Create_popup(null, from_server_.message, "창닫기");
        return;
      }
      //DataInfo.set_page_value("ShowingContent",temp_)
      var clicked_content_ = temp_;
      from_server_ = from_server_.message;
      Object.assign(clicked_content_, from_server_[0]);
      var temp_place_ = clicked_content_[Util_.dbdi("place")].split("-");
      DataInfo.Public_memmory.TEMP = {
        type: 2,
        user: DataInfo.return_user_num(),
        place1: temp_place_[0],
        place2: temp_place_[1],
        category: clicked_content_[Util_.dbdi("cate")],
        du_date: null,
        case_num: clicked_content_[Util_.dbdi("case")],
        party_name: clicked_content_[Util_.dbdi("party_n")],
        party_position: clicked_content_[Util_.dbdi("party_p")],
        oponent: clicked_content_[Util_.dbdi("oponent")],
        cost: null,
        else: clicked_content_[Util_.dbdi("else")],
        memo: null,
        num: num_,
      };

      DataInfo.page_move(7, "후속복대리 작성", true);
    }

    async Action_click_revise(num_) {
      var clicked_content_ = Util_.find_data_from_dataSource(
        DataInfo.get_page_memmory("ResArr"),
        num_,
        DataInfo.get_page_memmory("SelectedCategory")["selector"]
      );
      DataInfo.set_page_value("ShowingContent", clicked_content_);
      var index_ = DataInfo.get_page_memmory("SelectedCategory")["index"];

      if (index_ === 0) this.Revise_content_noDetails(num_);
      else if (index_ === 1)
        Revise_comment(
          num_,
          clicked_content_.content_comment,
          clicked_content_.anonymous
        );
      else if (index_ === 2 || index_ === 3 || index_ === 5) {
        if (clicked_content_["is_comment"]) {
          Popup.Create_popup(null, Util_.text_with_newline("복대리 선정 이후에는 내용을 수정하실 수 없습니다.\n수임한 변호사님께 개별적으로 연락해 주세요."), "창닫기");
          return;
        }
        var mesg_ = await check_form_req_repository_details({
          type: "double",
          num: num_,
          user: DataInfo.return_user_num(),
          for_revise: true,
        });
        if (!mesg_.success) {
          Popup.Create_popup(null, mesg_.message, "창닫기");
          return;
        }

        var from_server_ = await Util_.cli_to_server(
          index_ === 5
            ? "/repository/req_repository_second_details"
            : "/repository/req_repository_details",
          {
            type: "double",
            num: num_,
            user: DataInfo.return_user_num(),
            for_revise: true,
          },
          "POST"
        );
        if (!from_server_.success) {
          Popup.Create_popup(null, from_server_.message, "창닫기");
          return;
        }
        from_server_ = from_server_.message;
        Object.assign(clicked_content_, from_server_[0]);
        clicked_content_.details = clicked_content_;
        //후에 구분자 "-" 이거 변경 ㅣㄹ요============================================
        var temp_place_ = clicked_content_[Util_.dbdi("place")].split("-");

        //=============================================================
        DataInfo.Public_memmory.TEMP = {
          type: index_ === 5 ? 3 : 1,
          user: DataInfo.return_user_num(),
          place1: temp_place_[0],
          place2: temp_place_[1],
          category: clicked_content_[Util_.dbdi("cate")],
          du_date: clicked_content_[Util_.dbdi("date_d")],
          case_num: clicked_content_[Util_.dbdi("case")],
          party_name: clicked_content_[Util_.dbdi("party_n")],
          party_position: clicked_content_[Util_.dbdi("party_p")],
          oponent: clicked_content_[Util_.dbdi("oponent")],
          cost: clicked_content_[Util_.dbdi("cost")],
          else: clicked_content_[Util_.dbdi("else")],
          num: clicked_content_[Util_.dbdi("num")],
          memo: clicked_content_[Util_.dbdi("memo")],
        };
        DataInfo.page_move(
          7,
          index_ === 5 ? "후속복대리 수정" : "복대리 수정",
          true
        );
      }
    }
    async Action_click_details(num_) {
      var index_ = DataInfo.get_page_memmory("SelectedCategory")["index"];
      if (index_ == 2 || index_ == 3)
        Content.DetailsCallbackNamespace.Req_details_double(
          "/repository/req_repository_details",
          num_
        );
      else if (index_ == 5) {
        Content.DetailsCallbackNamespace.Req_details_double(
          "/repository/req_repository_second_details",
          num_
        );
      } else
        Content.DetailsCallbackNamespace.Req_details_qa(
          "/repository/req_repository_details",
          num_
        );
    }
    Make_repository_preshow_controller(num_, else_, else2_ = null) {
      // else_: 댓글 수, is_comment,
      var selector_ = DataInfo.get_page_memmory("SelectedCategory")["index"];
      if (selector_ == 4) {
        return React.createElement(
          "div",
          { className: "repository_preshow_controller" },
          React.createElement(
            "div",
            {
              className:
                "repository_controller_button normal_text button_style1",
              onClick: this.Action_click_details.bind(this, else_),
            },
            "원본보기"
          ),
          React.createElement(
            "div",
            {
              className:
                "repository_controller_button normal_text button_style1",
              onClick: Content.Delete_function.bind(
                this,
                "/repository/req_repository_delete",
                4,
                num_
              ),
            },
            "목록 삭제"
          )
        );
      } else if (selector_ == 3) {
        if (else2_) {
          console.log(else2_);
          return React.createElement(
            "div",
            { className: "repository_preshow_controller place_right" },
            React.createElement(
              "div",
              {
                className:
                  "repository_controller_button normal_text button_style1",
                onClick: this.Action_click_details.bind(this, num_),
              },
              "원본보기"
            ),
            React.createElement(
              "div",
              {
                className:
                  "repository_controller_button normal_text button_style1",
                onClick: this.Req_double_report.bind(this, num_),
              },
              "결과보기"
            )
          );
        } else {
          return React.createElement(
            "div",
            { className: "repository_preshow_controller place_right" },
            React.createElement(
              "div",
              {
                className:
                  "repository_controller_button normal_text button_style1",
                onClick: this.Action_click_details.bind(this, num_),
              },
              "원본보기"
            ),
            React.createElement(
              "div",
              {
                className:
                  "repository_controller_button normal_text button_style1",
                onClick: this.Action_click_write_report.bind(this, num_),
              },
              "결과통지"
            )
          );
        }
      }
      if (selector_ == 2) {
        if (else_ && else2_) {
          return React.createElement(
            "div",
            { className: "repository_preshow_controller place_right" },
            React.createElement(
              "div",
              {
                className:
                  "repository_controller_button normal_text button_style1",
                onClick: this.Action_click_details.bind(this, num_),
              },
              "원본보기"
            ),
            React.createElement(
              "div",
              {
                className:
                  "repository_controller_button normal_text button_style1",
                onClick: this.Req_double_report.bind(this, num_),
              },
              "결과보기"
            ),
            React.createElement(
              "div",
              {
                className:
                  "repository_controller_button normal_text button_style1",
                onClick: this.Action_click_second.bind(this, num_),
              },
              "후속복대리 신청"
            )
          );
        } else if (else_ && !else2_) {
          return React.createElement(
            "div",
            { className: "repository_preshow_controller place_right" },
            React.createElement(
              "div",
              {
                className:
                  "repository_controller_button normal_text button_style1",
                onClick: this.Action_click_details.bind(this, num_),
              },
              "원본보기"
            ),
            React.createElement(
              "div",
              {
                className:
                  "repository_controller_button normal_text button_style1",
                onClick: this.Action_click_second.bind(this, num_),
              },
              "후속복대리 신청"
            )
          );
        } else {
          return React.createElement(
            "div",
            { className: "repository_preshow_controller place_right" },
            React.createElement(
              "div",
              {
                className:
                  "repository_controller_button normal_text button_style1",
                onClick: this.Action_click_details.bind(this, num_),
              },
              "원본보기"
            ),
            React.createElement(
              "div",
              {
                className:
                  "repository_controller_button normal_text button_style1",
                onClick: this.Action_click_revise.bind(this, num_),
              },
              "수정하기"
            ),
            React.createElement(
              "div",
              {
                className:
                  "repository_controller_button normal_text button_style1",
                onClick: Content.Delete_function.bind(
                  this,
                  "/repository/req_repository_delete",
                  2,
                  num_
                ),
              },
              "삭제하기"
            )
          );
        }
      } else if (selector_ == 0 && else_ > 0) {
        // 답글 있는 qa
        return React.createElement(
          "div",
          { className: "repository_preshow_controller place_right" },
          React.createElement(
            "div",
            {
              className:
                "repository_controller_button normal_text button_style1",
              onClick: this.Action_click_details.bind(this, num_),
            },
            "원본보기"
          ),
          React.createElement(
            "div",
            {
              className:
                "repository_controller_button normal_text button_style1",
              onClick: this.Action_click_revise.bind(this, num_),
            },
            "수정하기"
          )
        );
      } else {
        return React.createElement(
          "div",
          { className: "repository_preshow_controller place_right" },
          React.createElement(
            "div",
            {
              className:
                "repository_controller_button normal_text button_style1",
              onClick: this.Action_click_details.bind(
                this,
                selector_ === 0 || selector_ === 5 ? num_ : else_
              ),
            },
            "원본보기"
          ),
          React.createElement(
            "div",
            {
              className:
                "repository_controller_button normal_text button_style1",
              onClick: this.Action_click_revise.bind(this, num_),
            },
            "수정하기"
          ),
          React.createElement(
            "div",
            {
              className:
                "repository_controller_button normal_text button_style1",
              onClick: Content.Delete_function.bind(
                this,
                "/repository/req_repository_delete",
                selector_,
                num_
              ),
            },
            "삭제하기"
          )
        );
      }
    }
    Repository_preshow_template(
      num_,
      index_,
      category_,
      title_,
      content_,
      additional_,
      else_,
      else_2 = null
    ) {
      return React.createElement(
        "div",
        { key: index_, className: "repository_preshow_area" }, //, onClick:this.Action_click_preshow.bind(this,num_)},
        Content.Content_preshow_template(
          category_,
          title_,
          content_,
          additional_,
          this.Make_repository_preshow_controller(num_, else_, else_2)
        )
      );
    }

    render() {
      var selector_ = DataInfo.get_page_memmory("SelectedCategory")["index"];
      if (selector_ == 0) {
        var temp_ = Content.PreshowNamespace.Create_preshow_content(val_);
        return this.Repository_preshow_template(
          val_[Util_.dbdi("num")],
          index_,
          temp_[0],
          temp_[1],
          temp_[2],
          temp_[3],
          val_[Util_.dbdi("count_c")]
        );
      } else if (selector_ == 2 || selector_ == 3 || selector_ == 5) {
        var temp_ = Content.PreshowNamespace.Create_preshow_double(val_);
        return this.Repository_preshow_template(
          val_[Util_.dbdi("num")],
          index_,
          temp_[0],
          temp_[1],
          temp_[2],
          temp_[3],
          val_[Util_.dbdi("is_comment")],
          val_[Util_.dbdi("is_report")]
        );
      } else if (selector_ == 1) {
        var temp_ = Content.PreshowNamespace.Create_preshow_comment(val_);
        return this.Repository_preshow_template(
          val_[Util_.dbdi("num_c")],
          index_,
          temp_[0],
          temp_[1],
          temp_[2],
          temp_[3],
          val_[Util_.dbdi("num")]
        );
      } else if (selector_ == 4) {
        var temp_ = Content.PreshowNamespace.Create_preshow_content(val_);
        return this.Repository_preshow_template(
          val_[Util_.dbdi("num_s")],
          index_,
          temp_[0],
          temp_[1],
          temp_[2],
          temp_[3],
          val_[Util_.dbdi("num")]
        );
      }
    }
  };
}

class Repository extends React.Component {
  constructor() {
    super();
    this.sendData = {
      type: 0,
      num: null,
      user: DataInfo.return_user_num(),
      offset: 0,
    };
    this.state = {
      index_class: [
        "repository_file_category active",
        "repository_file_category",
        "repository_file_category",
        "repository_file_category",
        "repository_file_category",
        "repository_file_category",
      ],
      list_ele: null,
      get_more_data: this.get_more_data.bind(this),
    };
  }
  async get_more_data() {
    var mesg_ = await check_form_req_repository_preshow(this.sendData);
    if (!mesg_.success) {
      Popup.Create_popup(null, mesg_.message, "창닫기");
      return;
    }

    var from_server_ = await Util_.cli_to_server(
      "/repository/req_repository_preshow",
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
  async get_repository_from_server(button_index_, get_from_server_) {
    var temp_ = DataInfo.get_page_memmory("SelectedCategory");
    temp_["index"] = button_index_;
    this.sendData.offset = 0;

    if (button_index_ == 0) {
      temp_["selector"] = Util_.dbdi("num");
    }
    if (button_index_ == 1) {
      temp_["selector"] = Util_.dbdi("num_c");
    }
    if (button_index_ == 2 || button_index_ == 3 || button_index_ == 5) {
      temp_["selector"] = Util_.dbdi("num");
    }
    if (button_index_ == 4) {
      temp_["selector"] = Util_.dbdi("num_s");
    }
    this.sendData.type = button_index_;

    var mesg_ = await check_form_req_repository_preshow(this.sendData);
    if (!mesg_.success) {
      Popup.Create_popup(null, mesg_.message, "창닫기");
      return;
    }

    if (get_from_server_) {
      var from_server_ = await Util_.cli_to_server(
        "/repository/req_repository_preshow",
        this.sendData,
        "POST"
      );
      if (!from_server_.success) {
        Util_.make_element("div", "repository_mid", null, from_server_.message);
        return false;
      }
      this.sendData.offset += from_server_.message.length;
      DataInfo.set_page_value("ResArr", from_server_.message);
    } else {
      this.sendData.offset = DataInfo.get_page_memmory("ResArr").length;
    }
    //Content.ContentListNamespace.Create_content_list(DataInfo.get_page_memmory(),"repository_mid")
    Util_.make_element(
      MakeContentList(this.state, RepositoryPreshow, this.props.page_move),
      "repository_mid"
    );

    this.state.index_class.fill("repository_file_category");
    this.state.index_class[button_index_] = "repository_file_category active";
    this.setState(this.state);
  }

  event_repository_page(type_, val_, e) {
    if (type_ === "click_menu") {
      this.get_repository_from_server(val_, true);
    }
  }
  componentDidMount() {
    console.log("repo did mount");
    console.log(DataInfo.get_page_memmory());
    if (DataInfo.return_page_num() != 5) {
      console.log("not page 5, re init");
      DataInfo.page_move(5, "나의 이력", false, false);
    } else if (DataInfo.get_page_memmory()) {
      console.log("we have page ", DataInfo.get_page_memmory());
      this.get_repository_from_server(
        DataInfo.get_page_memmory("SelectedCategory").index,
        false
      );
      return;
    }
    DataInfo.init_page_memory({
      SelectedCategory: { index: 0, selector: Util_.dbdi("num") }, //0:작성글,1:답변글,2:작성복대리,3:답변복대리,4:스크랩,5:후속
      ResArr: null,
      ShowingPage: { now: 0, end: null }, //페이지 넘버 관련
      ShowingContent: null,
      ShowingContentNum: null,
      DataSource: "ResArr",
    });

    this.get_repository_from_server(
      DataInfo.get_page_memmory("SelectedCategory").index,
      true
    );
  }
  render() {
    return (
      <div id="repository">
        <div id="repository_file_menu">
          <div className="double_width_container inline_container">
            <div
              className={this.state.index_class[0]}
              onClick={this.event_repository_page.bind(this, "click_menu", 0)}
            >
              나의 글
            </div>
            <div
              className={this.state.index_class[1]}
              onClick={this.event_repository_page.bind(this, "click_menu", 1)}
            >
              나의 답글
            </div>
            <div
              className={this.state.index_class[2]}
              onClick={this.event_repository_page.bind(this, "click_menu", 2)}
            >
              나의 위임
            </div>
            <div
              className={this.state.index_class[3]}
              onClick={this.event_repository_page.bind(this, "click_menu", 3)}
            >
              나의 수임
            </div>
            <div
              className={this.state.index_class[4]}
              onClick={this.event_repository_page.bind(this, "click_menu", 4)}
            >
              글 스크랩
            </div>
            <div
              className={this.state.index_class[5]}
              onClick={this.event_repository_page.bind(this, "click_menu", 5)}
            >
              후속복대리
            </div>
          </div>
        </div>
        <div id="repository_mid"></div>
      </div>
    );
  }
}

export default withRouter(Repository);
