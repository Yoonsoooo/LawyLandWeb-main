import Util_ from "./GlobalFtn";
import React from "react";
import Popup from "./Popup";
import Fullscreen from "./Fullscreen";
import check from "./CheckForm";

import user_img from "../../images/balancescale.png";
import comment_img from "../../images/comment.png";
import scrap_img from "../../images/scrap.png";
import view_img from "../../images/viewicon.png";

export default (function () {
  "use strict";

  //-----------------------
  //public ftn
  async function check_form_req_search_details(data_) {
    if (!check.isContentOrDouble(data_.type)) {
      return { success: false, message: "잘못된 type 입니다" };
    }
    if (!check.isNumberInteger(data_.num)) {
      return { success: false, message: "잘못된 num 입니다" };
    }
    if (!check.isStringMinLength(data_.bank_name, 0)) {
      return { success: true, message: null };
    }
    if (!check.isStringMinLength(data_.bank_user, 0)) {
      return { success: true, message: null };
    }
    if (!check.isStringMinLength(data_.bank_account, 0)) {
      return { success: true, message: null };
    }

    return { success: true, message: null };
  }

  function CreateContentComment(comment_data_, user_type_, content_num_, url_) {
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          input_comment: "",
          input_parent: 0,
          input_anonymous: false,
          input_button_text: "답글 작성",
          reset_parent_button: null,

          comment_ele_list: [],
        };
        this.URL = url_;
        this.revise_flag = 0;
        this.revise_comment_num = null;

        this.clicked_comment_index = null;
        (this.comment_class_clicked = new Array(comment_data_.length).fill(
          "comment_default"
        )),
          (this.TEMP = {});
      }
      Change_input_state(type_, e) {
        if (type_ == "input") this.state.input_comment = e.target.value;
        else if (type_ == "anonymous")
          this.state.input_anonymous = e.target.checked;
        this.setState(this.state);
      }
      Make_reset_button() {
        this.TEMP.reset_parent_button = React.createElement(
          "div",
          {
            id: "parent_reset_button",
            onClick: this.Reset_parent_num.bind(this, false),
          },
          "X"
        );
        this.revis_flag = false;
        this.setState(this.TEMP);
        this.TEMP = {};
      }
      Reset_parent_num(new_data_ = null) {
        this.TEMP.input_comment = "";
        this.TEMP.reset_parent_button = null;
        this.TEMP.input_parent = 0;
        this.TEMP.input_button_text = "댓글 작성";
        this.TEMP.input_anonymous = false;
        this.revise_flag = false;
        if (new_data_) {
          //this.comment_class_clicked=new Array(new_data_.length).fill("comment_default")
          (this.comment_class_clicked = new Array(new_data_.length).fill(
            "comment_default"
          )),
            (this.clicked_comment_index = null);
          DataInfo.get_page_memmory("ShowingContent").comment = new_data_;
          if (this.props.SetCommentLen) {
            this.props.SetCommentLen(new_data_.length);
          }
          this.Map_content_comment_container(new_data_);
        } else {
          if (this.clicked_comment_index !== null)
            (this.comment_class_clicked[this.clicked_comment_index] =
              "comment_default"),
              (this.clicked_comment_index = null);
          this.Map_content_comment_container(
            DataInfo.get_page_memmory("ShowingContent").comment
          );
        }
      }
      async Action_confirm_comment_button(num_) {
        Popup.Create_popup(
          null,
          Util_.text_with_newline("답글을 입력 중입니다.\n잠시만 기다려주세요."),
          "창 닫기"
        );
        if (this.revise_flag) {
          var to_server_ = {
            num: this.revise_comment_num,
            content_num: num_,
            user: DataInfo.return_user_num(),
            anonymous: this.state.input_anonymous ? true : false,
            content: this.state.input_comment,
          };
          //var from_server_=await Util_.cli_to_server('/repository/req_repository_update',to_server_,"POST")
          var from_server_ = await Util_.cli_to_server(
            this.URL.revise_comment,
            to_server_,
            "POST"
          );
        } else {
          var to_server_ = {
            parent_num: this.state.input_parent,
            num: num_,
            user: DataInfo.return_user_num(),
            anonymous: this.state.input_anonymous ? true : false,
            content: this.state.input_comment,
          };
          var from_server_ = await Util_.cli_to_server(
            this.URL.write_comment,
            to_server_,
            "POST"
          );
        }
        if (from_server_.success) {
          Popup.Create_popup(
            null,
            this.revise_flag ? "댓글 수정이 완료되었습니다." : "답변 등록 완료",
            "창 닫기"
          );
          this.Reset_parent_num(from_server_.message);
        } else {
          this.Reset_parent_num(null);
          Popup.Create_popup(null, from_server_.message, "창 닫기");
        }
      }
      async Action_comment_sub_button(comment_num_) {
        Popup.Create_popup(
          null,
          Util_.text_with_newline("요청사항을 수행 중입니다.\n잠시만 기다려주세요."),
          "창 닫기"
        );
        var from_server_ = await Util_.cli_to_server(
          this.URL.sub_comment,
          {
            type: "comment",
            user: DataInfo.return_user_num(),
            num: comment_num_,
          },
          "POST"
        );
        if (from_server_.success) {
          console.log(DataInfo.get_showing_content("comment"))
          var clicked_ele_ = Util_.find_data_from_dataSource(
            DataInfo.get_showing_content("comment"),
            comment_num_,
            Util_.dbdi("num_c")
          );
          clicked_ele_[Util_.dbdi("count_sc")] += 1;
          this.Map_content_comment_container(
            DataInfo.get_page_memmory("ShowingContent").comment
          );
        }
        Popup.Create_popup(
          null,
          from_server_.success ? "추천 성공" : from_server_.message,
          "창닫기"
        );
      }
      Action_comment_comment(index_, reply_to_) {
        this.revise_flag = false;
        this.TEMP.comment_class_clicked = this.state.comment_class_clicked;
        //this.comment_class_clicked[index_]="comment_click"
        if (this.clicked_comment_index !== null)
          this.comment_class_clicked[this.clicked_comment_index] =
            "comment_default";
        this.comment_class_clicked[index_] = "comment_click";
        this.clicked_comment_index = index_;
        //-----------
        this.TEMP.input_anonymous = false;
        this.TEMP.input_comment = "";
        this.TEMP.input_parent = reply_to_;
        this.TEMP.input_button_text = "답글 작성";
        this.Map_content_comment_container(
          DataInfo.get_page_memmory("ShowingContent").comment
        );
        this.Make_reset_button();
      }
      async Delete_comment(num_) {
        Popup.Create_popup(
          null,
          Util_.text_with_newline("댓글을 삭제 중입니다.\n 잠시만 기달려주세요."),
          "창 닫기"
        );
        var from_server_ = await Util_.cli_to_server(
          this.URL.delete_comment,
          { type: 1, num: num_, user: DataInfo.return_user_num() },
          "POST"
        );
        if (from_server_.success) {
          var is_updated_ = await Util_.update_data_from_dataSource(
            DataInfo.get_page_memmory("ShowingContent").comment,
            num_,
            {
              name: "*****",
              field: 0,
              acquisition: 2021,
              content_comment: "삭제된 댓글",
            },
            Util_.dbdi("num_c")
          );
          if (is_updated_) this.Reset_parent_num(null);
          else
            from_server_.message +=
              "(현 페이지 새로고침 실패, 전문보기를 다시 펼쳐주세요)";
        }
        Popup.Create_popup(null, from_server_.message, "창 닫기");
      }
      Revise_comment(index_, num_) {
        var target_ = Util_.find_data_from_dataSource(
          DataInfo.get_page_memmory("ShowingContent").comment,
          num_,
          Util_.dbdi("num_c")
        );
        //this.comment_class_clicked[index_]="comment_click"
        if (this.clicked_comment_index !== null)
          this.comment_class_clicked[this.clicked_comment_index] =
            "comment_default";
        this.comment_class_clicked[index_] = "comment_click";
        this.clicked_comment_index = index_;
        //-----------
        this.Map_content_comment_container(
          DataInfo.get_page_memmory("ShowingContent").comment
        );
        this.revise_flag = true;
        this.revise_comment_num = num_;
        this.TEMP.input_comment = target_.content_comment;
        this.TEMP.input_anonymous = target_.anonymous;
        this.TEMP.input_button_text = "댓글 수정";
        this.Make_reset_button();
      }
      Content_comment_template(key_, val_, controller_ = null) {
        var temp_comment_box_class_name_ =
          val_[Util_.dbdi("parent")] == 0
            ? "content_comment_container"
            : "content_comment_child_container";
        return React.createElement(
          "div",
          { key: key_, className: temp_comment_box_class_name_ },
          React.createElement("img", {
            className: "user_img",
            src: user_img,
          }),
          React.createElement(
            "div",
            { className: "content_comment_box" },
            React.createElement(
              "div",
              { className: "content_comment_userinfo" },
              React.createElement(
                "div",
                { className: "normal_text" },
                `${val_[Util_.dbdi("name")]} 변호사님`
              ),
              React.createElement(
                "div",
                { className: "normal_text date_text_color" },
                `${
                  Util_.category_to_string("field", val_[Util_.dbdi("field")])
                    ? Util_.category_to_string(
                        "field",
                        val_[Util_.dbdi("field")]
                      ) + "전문"
                    : ""
                } 변호사  ${val_[Util_.dbdi("date_a")]}년도에 등록`
              )
            ),
            React.createElement(
              "div",
              {
                className:
                  "content_comment_content normal_text comment_text_color",
              },
              val_[Util_.dbdi("content_comment")]
            ),
            controller_
          )
        );
      }
      Make_content_comment_controller(
        comment_num_,
        parent_num_,
        user_type_,
        date_,
        sub_count_,
        box_index_
      ) {
        //-------------------이벤트 수정 필요
        date_ = Util_.make_date_format(date_);
        if (parent_num_ == 0 && user_type_ == 0) {
          return React.createElement(
            "div",
            { className: "comment_controller inline_container" },
            React.createElement(
              "div",
              { className: "normal_text date_text_color" },
              date_
            ),
            React.createElement(
              "div",
              {
                className: "comment_input",
                onClick: this.Action_comment_comment.bind(
                  this,
                  box_index_,
                  comment_num_
                ),
              },
              "답글"
            ),
            React.createElement(
              "div",
              {
                className: "comment_sub",
                onClick: this.Action_comment_sub_button.bind(
                  this,
                  comment_num_
                ),
              },
              `추천${sub_count_}`
            ),
            React.createElement(
              "div",
              {
                className: "comment_sub",
                onClick: this.Delete_comment.bind(this, comment_num_),
              },
              `삭제`
            ),
            React.createElement(
              "div",
              {
                className: "comment_sub",
                onClick: this.Revise_comment.bind(
                  this,
                  box_index_,
                  comment_num_
                ),
              },
              `수정`
            )
          );
        } else if (parent_num_ == 0 && user_type_ == 1) {
          return React.createElement(
            "div",
            { className: "comment_controller inline_container" },
            React.createElement(
              "div",
              { className: "normal_text date_text_color" },
              date_
            ),
            React.createElement(
              "div",
              {
                className: "comment_input",
                onClick: this.Action_comment_comment.bind(
                  this,
                  box_index_,
                  comment_num_
                ),
              },
              "답글"
            ),
            React.createElement(
              "div",
              {
                className: "comment_sub",
                onClick: this.Action_comment_sub_button.bind(
                  this,
                  comment_num_
                ),
              },
              `추천${sub_count_}`
            )
          );
        } else if (parent_num_ != 0 && user_type_ == 0) {
          return React.createElement(
            "div",
            { className: "comment_controller inline_container" },
            React.createElement(
              "div",
              { className: "normal_text date_text_color" },
              date_
            ),
            React.createElement(
              "div",
              {
                className: "comment_sub",
                onClick: this.Action_comment_sub_button.bind(
                  this,
                  comment_num_
                ),
              },
              `추천${sub_count_}`
            ),
            React.createElement(
              "div",
              {
                className: "comment_sub",
                onClick: this.Delete_comment.bind(this, comment_num_),
              },
              `삭제`
            ),
            React.createElement(
              "div",
              {
                className: "comment_sub",
                onClick: this.Revise_comment.bind(
                  this,
                  box_index_,
                  comment_num_
                ),
              },
              `수정`
            )
          );
        } else if (parent_num_ != 0 && user_type_ == 1) {
          // if(parent_num_!=0 && user_num_!=2){
          return React.createElement(
            "div",
            { className: "comment_controller inline_container" },
            React.createElement(
              "div",
              { className: "normal_text date_text_color" },
              date_
            ),
            React.createElement(
              "div",
              {
                className: "comment_sub",
                onClick: this.Action_comment_sub_button.bind(
                  this,
                  comment_num_
                ),
              },
              `추천${sub_count_} `
            )
          );
        }
      }
      Sort_content_comment(comment_data_arr_) {
        var temp_return = [];
        for (var a = 0; a < comment_data_arr_.length; a++) {
          if (comment_data_arr_[a][Util_.dbdi("parent")] == 0)
            temp_return.push(comment_data_arr_[a]);
          else if (comment_data_arr_[a][Util_.dbdi("parent")] != 0) {
            var arr_len_ = temp_return.length;
            for (var b = 0; b < arr_len_; b++) {
              if (
                comment_data_arr_[a][Util_.dbdi("parent")] ==
                  temp_return[b][Util_.dbdi("num_c")] ||
                comment_data_arr_[a][Util_.dbdi("parent")] ==
                  temp_return[b][Util_.dbdi("parent")]
              ) {
                if (b + 1 == arr_len_) {
                  temp_return.push(comment_data_arr_[a]);
                  break;
                }
                if (temp_return[b + 1][Util_.dbdi("parent")] == 0) {
                  temp_return.splice(b + 1, 0, comment_data_arr_[a]);
                  break;
                }
              }
            }
          }
        }
        return temp_return;
      }
      Map_content_comment_container(data_) {
        if (data_.length === 0) {
          var box_list_ = React.createElement(
            "div",
            {
              className:
                "content_comment_container content_comment_content normal_text comment_text_color",
            },
            "답글이 없습니다"
          );
        } else {
          data_ = this.Sort_content_comment(data_);
          var box_list_ = this.comment_class_clicked.map((val_, index_) => {
            return React.createElement(
              "div",
              { className: val_ },
              this.Content_comment_template(
                index_,
                data_[index_],
                this.Make_content_comment_controller(
                  data_[index_][Util_.dbdi("num_c")],
                  data_[index_][Util_.dbdi("parent")],
                  data_[index_].user_type,
                  data_[index_][Util_.dbdi("date")],
                  data_[index_][Util_.dbdi("count_sc")],
                  index_
                )
              )
            );
          });
        }
        this.TEMP.comment_ele_list = box_list_;
        this.setState(this.TEMP);
      }
      componentDidMount() {
        this.Map_content_comment_container(comment_data_);
      }
      render() {
        //create_comment_content
        if (user_type_ === 0) {
          var user_controller1_ = React.createElement(
            //----------------이벤트 등록 필요
            "div",
            {
              className: "confirm_comment_button",
              onClick: Delete_function.bind(
                this,
                `/repository/req_repository_delete`,
                0,
                content_num_
              ),
            },
            "삭제"
          );
          var user_controller2_ = React.createElement(
            //----------------이벤트 등록 필요
            "div",
            {
              className: "confirm_comment_button",
              onClick: Revise_content_hasDetails.bind(this),
            },
            "수정"
          );
        } else {
          var user_controller1_ = null;
          var user_controller2_ = null;
        }
        return React.createElement(
          "div",
          { id: "content_details_comment" },
          React.createElement(
            "div",
            { id: "content_comment_input_container" },
            React.createElement("input", {
              type: "text",
              className: "comment_input_box  confirm_comment_data",
              value: this.state.input_comment,
              onChange: this.Change_input_state.bind(this, "input"),
            }),
            React.createElement(
              "div",
              {
                id: "content_comment_input_controller",
                className: "normal_text",
              },
              React.createElement(
                "div",
                {
                  className: "confirm_comment_button",
                  onClick: this.Action_confirm_comment_button.bind(
                    this,
                    content_num_
                  ),
                },
                this.state.input_button_text
              ),
              this.state.reset_parent_button,
              user_controller1_,
              user_controller2_,
              React.createElement(
                "div",
                null,
                React.createElement(
                  "label",
                  null,
                  React.createElement("input", {
                    type: "checkbox",
                    className: "confirm_comment_data",
                    onChange: this.Change_input_state.bind(this, "anonymous"),
                    checked: this.state.input_anonymous,
                  }),
                  React.createElement("span", null, "익명")
                )
              )
            )
          ),
          React.createElement(
            "div",
            { id: "comment_render_place" },
            React.createElement(
              "div",
              { className: "content_comment_list" },
              this.state.comment_ele_list
            )
          )
        );
      }
    };
  }

  let PreshowNamespace = {
    Make_preshow_content_additional: function (
      date_,
      view_count_,
      sub_count_,
      comment_count_
    ) {
      return (
        <React.Fragment>
          <div className="normal_text">{Util_.make_date_format(date_)} {`조회수 ${view_count_}개 | 스크랩 ${sub_count_}회 | 답글 ${comment_count_}개`}</div>
        </React.Fragment>
      );
    },
    Make_preshow_content_category: function (category_) {
      const category_ele_ = category_.map((val_, index_) =>
        val_
          ? React.createElement(
              "div",
              { key: index_, className: "file_category" },
              Util_.category_to_string("category_qa", val_)
            )
          : null
      );
      return React.createElement(
        "div",
        { className: "content_preshow_category inline_container" },
        category_ele_
      );
    },
    Make_preshow_double_content: function (place_, du_date_, cost_) {
      return Util_.text_with_newline(`장소 : ${place_}
            기일 : ${Util_.make_date_format(du_date_, 1)}
            금액 : 금${cost_}원 정`);
    },
    Make_preshow_double_category: function (
      du_date_,
      is_comment_user,
      category_,
      is_report = null
    ) {
      var temp1_ = null;

      if (is_report) {
        temp1_ = React.createElement(
          "div",
          { className: "file_category green" },
          "결과통지서"
        );
      } else if (Util_.make_date_format(du_date_, 2) === Util_.get_now_date()) {
        temp1_ = React.createElement(
          "div",
          { className: "file_category red" },
          "긴급!"
        );
      }
      var temp2_ = React.createElement(
        "div",
        { className: "file_category" },
        is_comment_user ? "모집종료" : "모집중"
      );

      return React.createElement(
        "div",
        { className: "content_preshow_category inline_container" },
        temp1_,
        temp2_,
        React.createElement(
          "div",
          { className: "file_category" },
          Util_.category_to_string("place", category_)
        )
      );
    },
    Make_preshow_comment_additional: function (date_, sub_count_, anonymous_) {
      return React.createElement(
        "div",
        { className: "normal_text" },
        `${Util_.make_date_format(date_)} 스크랩 ${sub_count_}회 [${
          anonymous_ ? "익명" : "실명"
        }]`
      );
    },
    Create_preshow_content: function (data_) {
      var category_ = this.Make_preshow_content_category([
        data_[Util_.dbdi("cate1")],
        data_[Util_.dbdi("cate2")],
        data_[Util_.dbdi("cate3")],
      ]);
      var title_ = data_[Util_.dbdi("title")];
      // var content_ = Util_.text_with_newline(data_[Util_.dbdi("content")]);
      var content_ = data_[Util_.dbdi("content")];
      var additional_ = this.Make_preshow_content_additional(
        data_[Util_.dbdi("date")],
        data_[Util_.dbdi("count_v")],
        data_[Util_.dbdi("count_s")],
        data_[Util_.dbdi("count_c")]
      );
      return [category_, title_, content_, additional_];
    },
    Create_preshow_double: function (data_) {
      var category_ = this.Make_preshow_double_category(
        data_[Util_.dbdi("date_d")],
        data_[Util_.dbdi("is_comment")],
        data_[Util_.dbdi("cate")],
        data_[Util_.dbdi("is_report")]
      );
      var title_ = null;
      var content_ = this.Make_preshow_double_content(
        data_[Util_.dbdi("place")],
        data_[Util_.dbdi("date_d")],
        data_[Util_.dbdi("cost")]
      );
      var additional_ = null;
      return [category_, title_, content_, additional_];
    },
    Create_preshow_comment: function (data_) {
      var category_ = this.Make_preshow_content_category([
        data_[Util_.dbdi("cate1")],
        data_[Util_.dbdi("cate2")],
        data_[Util_.dbdi("cate3")],
      ]);
      var title_ = data_[Util_.dbdi("title")];
      var content_ = Util_.text_with_newline(
        "나의 답변: " + data_[Util_.dbdi("content_comment")]
      );
      var additional_ = this.Make_preshow_comment_additional(
        data_[Util_.dbdi("date_c")],
        data_[Util_.dbdi("count_sc")],
        data_[Util_.dbdi("anonymous")]
      );
      return [category_, title_, content_, additional_];
    },
  };

  let DetailsCallbackNamespace = {
    Make_double_apply_popup: function (num_) {
      function Callback_click_input_account() {
        var popup_data_ = DataInfo.get_public_memmory();
        DataInfo.collect_public_memmory();
        DetailsCallbackNamespace.Req_details_double(
          "/search/req_search_details",
          num_,
          popup_data_
        );
      }
      Popup.Create_popup(
        "수임료 입금 계좌",
        this.Popup_content_input_bank(),
        "취소",
        "신청",
        Callback_click_input_account
      );
    },
    Popup_content_input_bank: function () {
      DataInfo.set_public_value({ bank: null, name: null, account: null });
      function change_input_bank(type_, e) {
        DataInfo.get_public_memmory()[type_] = e.target.value;
      }
      return React.createElement(
        "div",
        { id: "input_account" },
        React.createElement("input", {
          type: "text",
          className: "popup_confirm_data input_style3",
          placeholder: "은행",
          onChange: change_input_bank.bind(this, "bank"),
        }),
        React.createElement("input", {
          type: "text",
          className: "popup_confirm_data input_style3",
          placeholder: "예금주",
          onChange: change_input_bank.bind(this, "name"),
        }),
        React.createElement("input", {
          type: "text",
          className: "popup_confirm_data input_style3",
          placeholder: "은행 계좌번호",
          onChange: change_input_bank.bind(this, "account"),
        })
      );
    },

    Req_details_double: async function (
      url_,
      num_,
      apply_ = false,
      val_name_ = "ResArr"
    ) {
      if (apply_) {
        var to_server_ = {
          type: "double",
          num: num_,
          user: DataInfo.return_user_num(),
          bank_name: apply_.bank,
          bank_user: apply_.name,
          bank_account: apply_.account,
        };
      } else
        var to_server_ = {
          type: "double",
          num: num_,
          user: DataInfo.return_user_num(),
        };
      var from_server_ = await Util_.cli_to_server(url_, to_server_, "POST");
      if (!from_server_.success) {
        Popup.Create_popup(
          null,
          Util_.text_with_newline(from_server_.message),
          "창닫기"
        );
        return false;
      }
      from_server_ = from_server_.message;
      var clicked_content_ = Util_.find_data_from_dataSource(
        DataInfo.get_page_memmory(val_name_),
        num_
      );
      clicked_content_ = Object.assign(clicked_content_, from_server_[0]);
      var showing_content_ = {};
      showing_content_.details = clicked_content_;
      showing_content_.comment = from_server_;
      DataInfo.set_page_value("ShowingContent", showing_content_);
      //DetailsPageNamespace.Create_details_page("double", showing_content_);
      Create_details_page("double", showing_content_);
      Popup.Action_cancel_button();
    },
    Req_details_qa: async function (url_, num_, val_name_ = "ResArr") {
      var mesg_ = await check_form_req_search_details({
        type: "content",
        num: num_,
        user: DataInfo.return_user_num(),
      });
      if (!mesg_.success) {
        Popup.Create_popup(null, mesg_.message, "창닫기");
        return;
      }

      var from_server_ = await Util_.cli_to_server(
        url_,
        { type: "content", num: num_, user: DataInfo.return_user_num() },
        "POST"
      );
      if (!from_server_.success) {
        Popup.Create_popup(
          null,
          Util_.text_with_newline(from_server_.message),
          "창닫기"
        );
        return false;
      }
      from_server_ = from_server_.message;
      var clicked_content_ = Util_.find_data_from_dataSource(
        DataInfo.get_page_memmory(val_name_),
        num_
      );
      clicked_content_ = Object.assign(
        clicked_content_,
        from_server_.details[0]
      );
      var showing_content_ = {};
      showing_content_.details = clicked_content_;
      showing_content_.details[Util_.dbdi("count_v")] += 1;
      showing_content_.comment = from_server_.comment;
      showing_content_.obj = from_server_.obj;
      DataInfo.set_page_value("ShowingContent", showing_content_);

      //DetailsPageNamespace.Create_details_page("content", showing_content_);
      Create_details_page("content", showing_content_);
    },
  };

  function Content_preshow_template(
    category_,
    thick_text_,
    light_text_,
    additional_,
    controller_ = null,
    index_ = 0
  ) {
    return React.createElement(
      "div",
      { key: index_, className: "content_preshow_container normal_text" },
      controller_,
      category_,
      React.createElement(
        "div",
        { className: "content_preshow_point" },
        React.createElement(
          "div",
          { className: "content_preshow_title" },
          thick_text_
        ),
        React.createElement(
          "div",
          { className: "content_preshow_content" },
          light_text_
        ),
        React.createElement(
          "div",
          { className: "content_preshow_additional" },
          additional_
        )
      )
    );
  }

  async function Revise_content_hasDetails() {
    var clicked_content_ = DataInfo.get_page_memmory("ShowingContent").details;
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

  async function Delete_function(url_, index_, num_) {
    async function send_to_server() {
      var from_server_ = await Util_.cli_to_server(
        url_,
        { type: index_, num: num_, user: DataInfo.return_user_num() },
        "POST"
      );
      if (from_server_.success) {
        var temp_ = {
          0: Util_.dbdi("num"),
          1: Util_.dbdi("num_c"),
          2: Util_.dbdi("num"),
          4: Util_.dbdi("num_s"),
          5: Util_.dbdi("num"),
        };
        if (DataInfo.get_page_memmory("DataSource")) {
          var is_deleted_ = await Util_.delete_data_from_dataSource(
            DataInfo.get_page_memmory(DataInfo.get_page_memmory("DataSource")),
            num_,
            temp_[index_]
          );
          if (
            is_deleted_ &&
            DataInfo.get_page_memmory("SelectedCategory")["index"] === index_
          ) {
            DataInfo.get_page_memmory("RENEW")();
          }
          Fullscreen.Action_cancel_button();
        }
      }
      Popup.Create_popup(null, from_server_.message, "창닫기");
    }

    Popup.Create_popup(
      null,
      "정말로 삭제하시겠습니까?",
      "아니요",
      "네",
      send_to_server
    );
  }

  class ContentDetails extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        sub_count: 0,
        comment_count: 0,
      };
    }
    SetCommentLen(len_) {
      this.setState({ comment_count: len_ });
    }
    Make_details_content_title(name_, field_, acquisition_, title_) {
      return React.createElement(
        "div",
        { id: "content_details_userinfo" },
        React.createElement("img", {
          className: "user_img",
          src: user_img,
        }),
        React.createElement(
          "div",
          { className: "content_comment_box" },
          React.createElement(
            "div",
            { className: "content_comment_userinfo" },
            React.createElement(
              "div",
              { className: "normal_text" },
              `${name_} 변호사님`
            ),
            React.createElement(
              "div",
              { className: "normal_text date_text_color" },
              `${
                Util_.category_to_string("field", field_)
                  ? Util_.category_to_string("field", field_) + "전문"
                  : ""
              } 변호사  ${acquisition_}년도에 등록`
            )
          )
        ),
        React.createElement("div", { id: "content_details_title" }, title_)
      );
    }
    async Action_click_add_scrap(content_num_) {
      var from_server_ = await Util_.cli_to_server(
        "/search/req_add_scrap",
        {
          type: "content",
          num: content_num_,
          user: DataInfo.Public_memmory.USERINFO.NUM,
        },
        "POST"
      );
      if (from_server_.success) {
        var inc_sub_ = this.state.sub_count + 1;
        if (DataInfo.get_page_memmory("SelectedCategory").index === 0) {
          var is_update_ = await Util_.update_data_from_dataSource(
            "ResArr",
            content_num_,
            { sub_count: inc_sub_ }
          );
          if (is_update_) DataInfo.get_page_memmory("RENEW")();
        }
        this.setState({
          sub_count: inc_sub_,
        });
        Popup.Create_popup(
          null,
          "스크랩 등록 완료 (나의 이력→글 스크랩에서 확인)",
          "창닫기"
        );
      } else if (!from_server_.success) {
        Popup.Create_popup(null, from_server_.message, "창닫기");
      }
    }
    Make_content_details_additional(
      sub_count_,
      comment_count_,
      view_count_,
      date_,
      num_
    ) {
      this.state.sub_count = sub_count_;
      this.state.comment_count = comment_count_;
      return React.createElement(
        "div",
        { id: "content_details_aditional", className: "inline_container" },
        React.createElement(
          "div",
          { className: "normal_text" },
          React.createElement("img", {
            src: scrap_img,
            onClick: this.Action_click_add_scrap.bind(this, num_),
          }),
          this.state.sub_count
        ),
        React.createElement(
          "div",
          { className: "normal_text" },
          React.createElement("img", { src: comment_img }),
          this.state.comment_count
        ),
        React.createElement(
          "div",
          { className: "normal_text" },
          React.createElement("img", { src: view_img }),
          view_count_
        ),
        React.createElement(
          "div",
          { className: "normal_text date_text_color place_right" },
          Util_.make_date_format(date_, 1)
        )
      );
    }
    Make_details_element(data_) {
      var temp_category_ = PreshowNamespace.Make_preshow_content_category([
        data_.details[Util_.dbdi("cate1")],
        data_.details[Util_.dbdi("cate2")],
        data_.details[Util_.dbdi("cate3")],
      ]);
      var temp_title_ = this.Make_details_content_title(
        data_.details[Util_.dbdi("name")],
        data_.details[Util_.dbdi("field")],
        data_.details[Util_.dbdi("date_a")],
        data_.details[Util_.dbdi("title")]
      );
      var temp_content_ = Util_.text_with_newline(
        data_.details[Util_.dbdi("content")]
      );
      var temp_additional_ = this.Make_content_details_additional(
        data_.details[Util_.dbdi("count_s")],
        //data_.details[Util_.dbdi("count_c")],
        data_.comment.length,
        data_.details[Util_.dbdi("count_v")],
        data_.details[Util_.dbdi("date")],
        data_.details[Util_.dbdi("num")]
      );
      var temp_comment_ = CreateContentComment(
        data_.comment,
        data_.details.user_type,
        data_.details.num,
        {
          revise_comment: "/search/req_comment_update",
          write_comment: "/search/req_write_comment",
          sub_comment: "/search/req_add_scrap",
          delete_comment: "/repository/req_repository_delete",
        }
      );
      temp_comment_ = React.createElement(temp_comment_, {
        SetCommentLen: this.SetCommentLen.bind(this),
      });
      return [
        temp_category_,
        temp_title_,
        temp_content_,
        temp_additional_,
        temp_comment_,
      ];
    }

    render() {
      var ele_ = this.Make_details_element(
        DataInfo.get_page_memmory("ShowingContent")
      );
      return React.createElement(DetailsPageTemplate, {
        category: ele_[0],
        title: ele_[1],
        content: ele_[2],
        additional: ele_[3],
        comment: ele_[4],
      });
    }
  }

  class DoubleDetails extends React.Component {
    Make_details_element(data_) {
      var temp_category_ = PreshowNamespace.Make_preshow_double_category(
        data_.details[Util_.dbdi("date_d")],
        data_.details[Util_.dbdi("is_comment")],
        data_.details[Util_.dbdi("cate")],
        data_.details[Util_.dbdi("is_report")]
      );
      var temp_title_ = React.createElement(
        "div",
        { id: "content_details_ti" },
        "사건 정보"
      );
      var temp_content_ = Util_.text_with_newline(`
            사  건 : ${data_.details[Util_.dbdi("case")]}
            법  원 : ${data_.details[Util_.dbdi("place")]}
            기  일 : ${Util_.make_date_format(
              data_.details[Util_.dbdi("date_d")],
              1
            )}
            당사자 : ${Util_.category_to_string(
              "position",
              data_.details[Util_.dbdi("party_p")]
            )}  ${data_.details[Util_.dbdi("party_n")]}
            상대방 : ${data_.details[Util_.dbdi("oponent")]}
            금  액 : 금${data_.details[Util_.dbdi("cost")]} 원 정
            체결일 : ${
              data_.details[Util_.dbdi("date_m")]
                ? Util_.make_date_format(data_.details[Util_.dbdi("date_m")], 1)
                : "아직 매칭중입니다"
            } `);
      var temp_additional_ = CreateDoubleComment(data_.comment);
      var temp_comment_ = CreateDoubleMemoElse(
        data_.details[Util_.dbdi("memo")],
        data_.details[Util_.dbdi("else")]
      );
      return [
        temp_category_,
        temp_title_,
        temp_content_,
        temp_additional_,
        temp_comment_,
      ];
    }

    render() {
      var ele_ = this.Make_details_element(
        DataInfo.get_page_memmory("ShowingContent")
      );
      return React.createElement(DetailsPageTemplate, {
        category: ele_[0],
        title: ele_[1],
        content: ele_[2],
        additional: ele_[3],
        comment: ele_[4],
      });
    }
  }

  function Create_details_page(type_, data_) {
    if (type_ == "content") {
      Fullscreen.Create_fullscreen(ContentDetails);
    } else if (type_ == "double") {
      Fullscreen.Create_fullscreen(DoubleDetails);
    }
  }
  //----------------------
  //private ftn
  //function Create_double_comment(data_,else_){
  function CreateDoubleMemoElse(memo_, else_) {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "content_comment_list1" },
        React.createElement("div", null, "전달 사항 "),
        memo_ ? Util_.text_with_newline(memo_) : null
      ),
      React.createElement(
        "div",
        { className: "content_comment_list2" },
        React.createElement("div", null, "사건 개요 "),
        else_ ? Util_.text_with_newline(else_) : null
      )
    );
  }
  function CreateDoubleComment(data_, else_) {
    var temp_comment_ = [];
    if (data_.length === 1) var index_user_ = 0;
    else if (data_[0].user_type === 0) {
      var index_user_ = 0;
      var index_comment_ = 1;
    } else {
      var index_user_ = 1;
      var index_comment_ = 0;
    }
    temp_comment_.push(
      Util_.text_with_newline(`
            위 임 인 : ${
              data_[index_user_][Util_.dbdi("name")]
            } 변호사님 / 법무법인 ${data_[index_user_][Util_.dbdi("agency")]}
            휴대전화 : ${data_[index_user_][Util_.dbdi("phone")]}
            이 메 일 : ${data_[index_user_][Util_.dbdi("email")]}`)
    );
    if (data_.length > 1) {
      //수정필요
      temp_comment_.push(
        Util_.text_with_newline(`
            수 임 인 : ${
              data_[index_comment_][Util_.dbdi("name")]
            } 변호사님 / 법무법인 ${data_[index_comment_][Util_.dbdi("agency")]}
            휴대전화 : ${data_[index_comment_][Util_.dbdi("phone")]}
            이 메 일 : ${data_[index_comment_][Util_.dbdi("email")]}
            은행이름 ${data_[index_comment_]["bank_name"]}
            예 금 주 : ${data_[index_comment_]["bank_user"]}
            계좌번호 : ${data_[index_comment_]["bank_account"]}`)
      );
    } else temp_comment_.push("아직 매칭되지 않았습니다.");
    return React.createElement(
      "div",
      { className: "content_comment_list" },
      React.createElement(
        "div",
        { className: "double_comment_container1" },
        temp_comment_[0]
      ),
      React.createElement(
        "div",
        { className: "double_comment_container2" },
        temp_comment_[1]
      )
    );
  }

  //-----------------------
  return {
    PreshowNamespace,
    Create_details_page,
    DetailsCallbackNamespace,
    Content_preshow_template,
    CreateContentComment,
    Delete_function,
  };
})();

class DetailsPageTemplate extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return React.createElement(
      "div",
      { id: "content_details_page" },
      React.createElement(
        "div",
        { id: "content_details_category", className: "inline_container" },
        this.props.category
      ),
      React.createElement(
        "div",
        { id: "content_details_top" },
        this.props.title
      ),
      React.createElement(
        "div",
        { id: "content_details_content", className: " normal_text" },
        this.props.content
      ),
      this.props.additional,
      this.props.comment
    );
  }
}
