import React from "react";
import "../stylesheets/write.css";
import Util_ from "./class/GlobalFtn";
import Popup from "./class/Popup";
import check from "./class/CheckForm";

import { withRouter } from "react-router-dom";

async function check_form_write(data_) {
  if (!check.isCategory(data_.category)) {
    return { success: false, message: "잘못된 카테고리 입니다" };
  } else if (!check.isBoolean(data_.anonymous)) {
    return { success: false, message: "잘못된 anonymous 입니다" };
  } else if (!check.isStrLenForm(data_.title, 50)) {
    return { success: false, message: "제목은 50자 이내로 작성해주세요" };
  } else if (!check.isStrLenForm(data_.content, 500)) {
    return { success: false, message: "본문은 500자 이내로 작성해주세요" };
  } else {
    return { success: true, message: null };
  }
}

class Write extends React.Component {
  constructor(props) {
    super(props);
    this.revise_flag = 0;
    this.state = {
      anonymous: false,
      category: null,
      title: null,
      content: null,
      title_text_count: 0,
      content_text_count: 0,
    };
    this.flag_ = 0;
    this.sendData = {
      category: [],
      title: null,
      content: null,
      user: DataInfo.return_user_num(),
      anonymous: false,
      file: null,
    };
  }
  event_write_page(type_, val_, e) {
    if (type_ == "send_data")
      Popup.Create_popup(
        null,
        "입력하신 내용대로 작성하시겠습니까?",
        "취소",
        "작성",
        this.action_write_confirm_data.bind(this)
      );
    else if (type_ == "select_category") this.action_select_category();
  }
  change_send_data(column_, e) {
    if (column_ === "title") {
      if (
        this.state.title_text_count >= 50 &&
        e.target.value.length > this.state.title_text_count
      ) {
        return;
      } else this.state.title_text_count = e.target.value.length;
    } else if (column_ === "content") {
      if (
        this.state.content_text_count >= 500 &&
        e.target.value.length > this.state.content_text_count
      ) {
        return;
      } else this.state.content_text_count = e.target.value.length;
    } else if (column_ === "anonymous")
      this.state["anonymous"] = e.target.checked;
    if (column_ !== "anonymous") this.state[column_] = e.target.value;
    this.setState(this.state);
  }
  action_select_category() {
    Popup.Create_popup(
      "분야 선택",
      "category",
      "취소",
      "선택",
      this.select_category_Write.bind(this),
      { max: 3, init_state: this.sendData.category, start_index: 1 }
    );
  }
  select_category_Write(data_) {
    var category_ = data_.popup_data;
    var temp_ = "";
    for (var i = 0; i < 3; i++) {
      if (!category_[i]) category_.push(null);
      else
        temp_ += ` ${Util_.category_to_string("category_qa", category_[i])} /`;
    }
    temp_.slice(0, -1);
    this.sendData.category = category_;
    this.state.category = temp_;
    this.setState(this.state);
    Popup.Action_cancel_button();
  }

  async action_write_confirm_data() {
    this.sendData.title = this.state.title;
    this.sendData.content = this.state.content;
    this.sendData.anonymous = this.state.anonymous ? true : false;
    if (
      !this.sendData.title ||
      !this.sendData.content ||
      !this.sendData.category[0]
    ) {
      Popup.Create_popup(null, "누락된 부분을 확인해 주세요.", "창닫기");
      return;
    }

    var mesg_ = await check_form_write(this.sendData);
    if (!mesg_.success) {
      Popup.Create_popup(null, mesg_.message, "창닫기");
      return;
    }

    var from_server_ = await Util_.cli_to_server(
      this.revise_flag === 0 ? "/write/write_path" : "/write/revise_path",
      this.sendData,
      "POST"
    );
    if (from_server_.success) {
      if (this.revise_flag === 1) {
        if (DataInfo.return_before_page_num() === 5)
          await Util_.update_data_from_dataSource(
            DataInfo.Page_memmory[DataInfo.PAGEOBJNAME[5]]?.ResArr,
            this.sendData.num,
            this.sendData,
            Util_.dbdi("num")
          );
        DataInfo.page_move(
          "before",
          DataInfo.return_before_page_num() === 11 ? "Q/A" : "나의 이력",
          false
        );
      } else {
        DataInfo.page_move(11, "Q/A", false);
        Popup.Create_popup(
          null,
          this.revise_flag ? "글 수정 성공" : "글 작성 성공",
          "창 닫기"
        );
      }
    } else Popup.Create_popup(null, from_server_.message, "창 닫기");
  }

  insert_data_to_writeFormat(data_, ele_ = ".write_confirm_data") {
    var temp_ = "";
    data_.category.forEach(function (val_) {
      if (val_) temp_ += `${Util_.category_to_string("category_qa", val_)} `;
    });

    this.setState({
      title: data_.title,
      content: data_.content,
      category: temp_,
      anonymous: data_.anonymous,
      title_text_count: data_.title.length,
      content_text_count: data_.content.length,
    });

    this.sendData.num = data_.num;
    this.sendData.title = data_.title;
    this.sendData.content = data_.content;
    this.sendData.category = data_.category;
    this.sendData.anonymous = data_.anonymous;
  }
  //------------------

  componentDidMount() {
    if (DataInfo.return_page_num() != 6) {
      this.props.page_move(6, "Q/A 작성", false, false);
    }
    if (DataInfo.get_public_memmory()) {
      if (DataInfo.get_public_memmory()["revise"]) {
        this.insert_data_to_writeFormat(DataInfo.Public_memmory.TEMP);
        this.revise_flag = 1;
        return;
      }
    }
    if (!DataInfo.get_public_memmory()) {
      this.revise_flag = 0;
      return;
    }
  }

  render() {
    return (
      <div id="write_mid">
        <div className="inline_container">
          <h3>Q/A</h3>
          <div>작성</div>
        </div>
        <div className="write_container content_preshow_container inline_container">
          <div className="check_box">
            <label>
              <input
                id="is_anonymous"
                className="write_confirm_data"
                type="checkbox"
                checked={this.state.anonymous}
                onChange={this.change_send_data.bind(this, "anonymous")}
              ></input>
              <span>익명질문</span>
            </label>
          </div>
          <div
            id="category_button"
            className="button_style2 place_right"
            onClick={this.event_write_page.bind(this, "select_category", null)}
          >
            분야(최대 3개)
          </div>
          <div id="status_category" className="status_box">
            {this.state.category}
          </div>
        </div>
        <div className="write_container content_preshow_container inline_container">
          <div>제목</div>
          <input
            id="input_title"
            className="input_style1 write_confirm_data place_right"
            type="text"
            placeholder="title"
            value={this.state.title}
            onChange={this.change_send_data.bind(this, "title")}
          ></input>

          <div>{this.state.title_text_count}/50</div>
        </div>
        <div className="write_container content_preshow_container ">
          <div>상세내용</div>

          <div>{this.state.content_text_count}/500</div>

          <textarea
            id="input_content"
            className="textarea_style1 write_confirm_data"
            placeholder="여기에 작성해주세요"
            value={this.state.content}
            onChange={this.change_send_data.bind(this, "content")}
          ></textarea>
        </div>
        {DataInfo.get_public_memmory()?.revise && (
          <div
            id="write_confirm_button"
            className="button_style1"
            onClick={this.event_write_page.bind(this, "send_data", null)}
          >
            수정하기
          </div>
        )}
        {!DataInfo.get_public_memmory()?.revise && (
          <div
            id="write_confirm_button"
            className="button_style1"
            onClick={this.event_write_page.bind(this, "send_data", null)}
          >
            작성하기
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Write);
