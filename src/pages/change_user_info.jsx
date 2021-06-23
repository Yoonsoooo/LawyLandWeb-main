import React from "react";
import Content from "./class/Content";
import { MakeContentList } from "./class/ContentList";
import Util_ from "./class/GlobalFtn";
import Popup from "./class/Popup";
import "../stylesheets/change_userinfo.css";
import check from "./class/CheckForm";

import user_img from "../images/balancescale.png";
import userinfo_back_img from "../images/backimg.png";

import { withRouter } from "react-router-dom";

//1.alarm preshow는 유저 번호밖에 없기에 잠깐 skip
//2.alarm details
async function check_form_req_useralarm_details(data_) {
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

async function check_form_Authentication(data_) {
  if (!check.isStrLenForm(data_.id, 28)) {
    return { success: false, message: "아이디를 정확히 입력해주세요" };
  } else if (!check.isStrLenForm(data_.pw, 15)) {
    return { success: false, message: "비밀번호를 정확히 입력해주세요" };
  } else if (!check.isLawnumForm(data_.law_num)) {
    return { success: false, message: "등록번호를 정확히 입력해주세요" };
  } else return { success: true, message: null };
}
//3.change
async function check_form_req_change_userinfo(data_) {
  //user num
  if (!check.isNumberRange(data_.info_index, 6, 1)) {
    if (data_.info_index !== 10)
      return {
        success: false,
        message: "잘못된 요청입니다 (어플을 다시 시작해주세요)",
      };
  }
  let temp_ = await check_form_Authentication(data_);
  if (!temp_.success) {
    return temp_;
  } else if (data_.index == 1) {
    if (!check.isStrLenForm(data_.data, 15)) {
      return {
        success: false,
        message: "변경할 닉네임을 15자 이내로 작성해주세요",
      };
    }
  } else if (data_.info_index == 2) {
    if (!check.isPhoneForm(data_.data)) {
      return {
        success: false,
        message: "휴대번호 10자리 또는 11자리 숫자를 입력해주세요.('-' 제외)",
      };
    }
  } else if (data_.info_index == 3) {
    if (!check.isStrLenForm(data_.data[0], 15)) {
      console.log(data_.data[0])
      return {
        success: false,
        message: "변경할 비밀번호를 15자 이내로 작성해주세요",
      };
    }
    if (data_.data[1] != data_.data[1]) {
      return {
        success: false,
        message: "변경될 비밀번호와 변경될 비밀번호 확인이 동일하지 않습니다",
      };
    }
  }
  if (data_.info_index == 4) {
    if (!check.isPlaceNum(data_.data)) {
      return { success: false, message: "지역을 정확히 선택해주세요" };
    }
  } else if (data_.info_index == 5) {
    if (!check.isStrLenForm(data_.data, 50)) {
      return { success: false, message: "소속을 50자 이내로 작성해주세요" };
    }
  } else if (data_.info_index == 6) {
    if (!check.isNumberRange(data_.data, 60)) {
      return { success: false, message: "전문분야를 선택해주세요" };
    }
  } else if (data_.info_index == 6) {
    if (data_.data) return { success: false, message: "잘못된 요청입니다" };
  }
  return { success: true, message: null };
}

function Callback_apply_second_double() {
  var popup_data_ = DataInfo.get_public_memmory();
  DataInfo.collect_public_memmory();
  console.log(popup_data_);
  Content.DetailsCallbackNamespace.Req_details_double(
    "/change_userinfo/apply_second_double",
    DataInfo.get_page_memmory("ShowingContentNum"),
    popup_data_
  );
}

class Popup_content_userAuthentication extends React.Component{
  constructor(props){
    super(props)
    this.result={
      input_id:null,
      input_pw:null,
      input_lawnum:null
    }
  }
  change_state(type_, e){
    this.props.set_state(type_,e.target.value)
  }
  render(){
    return React.createElement(
      "div",
      { className: "authentication_container" },
      React.createElement(
        "div",
        { className: "userinfo_popup_text normal_text" },
        "넘어가러면 본인인증을 통과하세요"
      ),
      React.createElement("input", {
        type: "text",
        onChange: this.change_state.bind(this, "input_id"),
        className: "userinfo_confirm_data input_style3",
        placeholder: "아이디 입력",
      }),
      React.createElement("input", {
        type: "password",
        onChange: this.change_state.bind(this, "input_pw"),
        className: "userinfo_confirm_data input_style3",
        placeholder: "비밀번호 입력",
      }),
      React.createElement("input", {
        type: "password",
        onChange: this.change_state.bind(this, "input_lawnum"),
        className: "userinfo_confirm_data input_style3",
        placeholder: "등록번호 입력",
      })
    );
  }
}

async function Popup_content_changeinfo(type_){
  if (type_ == 4) var temp_ =await Popup.PopupContentArray("place", 1,null,1)
  else if (type_ == 6) var temp_ =await Popup.PopupContentArray("field",1)
  return class extends React.Component{
    constructor(props){
      super(props)
      this.ClickedUserinfo = type_;
      this.temp=null
    }
    change_state(type_, e){
      console.log(e.target.value)
      if(type_===4) this.temp_[0]=e.target.value 
      else if(type_===5) this.temp_[1]=e.target.value 
      else this.temp_=e.target.value 
      this.props.set_state('popup_data',this.temp_)
    }
    Popup_content_oneinput(type_) {
      var temp_ = ["", "닉네임", "휴대번호"];
      return React.createElement("input", {
        type: "text",
        onChange: this.change_state.bind(this, 3),
        className: "userinfo_confirm_data input_style3",
        placeholder: type_===5?`법무법인, 기관명 등`:`새 ${temp_[type_]}입력`,
      });
    }
    Popup_content_pw() {
      this.temp_=[null,null]
      return React.createElement(
        "div",
        null,
        React.createElement("input", {
          type: "password",
          onChange: this.change_state.bind(this, 4),
          className: "userinfo_confirm_data input_style3",
          placeholder: `새 비밀번호 입력`,
        }),
        React.createElement("input", {
          type: "password",
          onChange: this.change_state.bind(this, 5),
          className: "userinfo_confirm_data input_style3",
          placeholder: `새 비밀번호 확인`,
        })
      );
    }

    render(){
      if (type_ === 1 || type_ === 2 || type_===5)
        var content_ = this.Popup_content_oneinput(type_);
      else if (type_ == 3) var content_ = this.Popup_content_pw();
      else if (type_ == 4){ 
        var content_=React.createElement(temp_,{set_state: this.props.set_state.bind(this)})
      }else if (type_ == 6){ 
        var content_=React.createElement(temp_,{set_state: this.props.set_state.bind(this)})
      }else if (type_ == 10)
        var content_ = "확인을 누르는 순간 탈퇴절차가 진행됩니다"
      return React.createElement(
        "div",
        { className: "double_width_content" },
        React.createElement(Popup_content_userAuthentication, {set_state: this.props.set_state.bind(this)}),
        content_
      );
    }
  }
}

function UserAlarmNamespace(index_, data_) {
  return class extends React.Component {
    async Action_click_second_preshow_popup(num_) {
      var from_server_ = await Util_.cli_to_server(
        "/change_userinfo/req_second_preshow",
        { type: 1, num: num_, user: DataInfo.return_user_num() },
        "POST"
      );
      if (from_server_.success) {
        from_server_ = from_server_.message[0];
        console.log(from_server_);
        DataInfo.set_page_value("ShowingContentNum", num_);
        Popup.Create_popup(
          "후속복대리 내용",
          Content.PreshowNamespace.Make_preshow_double_content(
            from_server_[Util_.dbdi("place")],
            from_server_[Util_.dbdi("date_d")],
            from_server_[Util_.dbdi("cost")]
          ),
          "취소",
          "수락",
          this.Apply_second_double
        );
      } else
        Popup.Create_popup(
          null,
          "글을 불러오는데 실패했습니다. 다시 시도해 주세요.",
          "창닫기"
        );
    }
    Apply_second_double() {
      Popup.Create_popup(
        "수임료 입금 계좌",
        Content.DetailsCallbackNamespace.Popup_content_input_bank(),
        "취소",
        "신청",
        Callback_apply_second_double.bind(this)
      );
    }
    Make_alarm_secondDouble_controller(num_) {
      return React.createElement(
        "div",
        { className: "alarm_controller normal_text" },
        React.createElement(
          "div",
          {
            className: "alarm_controller_button",
            onClick: this.Action_click_second_preshow_popup.bind(this, num_),
          },
          "내용 보기"
        ),
        React.createElement(
          "div",
          { className: "alarm_controller_button" },
          "거절하기"
        )
      );
    }
    Make_alarm_secondDouble_content(content_, date_, expire_) {
      return React.createElement(
        "div",
        { className: "alarm_content normal_text" },
        React.createElement(
          "div",
          { className: "alarm_content_text" },
          content_
        ),
        React.createElement(
          "div",
          { className: "alarm_content_additional" },
          `${Util_.make_date_format(date_)} | 만기일 ${Util_.make_date_format(
            expire_
          )}`
        )
      );
    }
    render() {
      if (data_.type == 1) {
        var content_ = this.Make_alarm_secondDouble_content(
          data_.content,
          data_.date,
          data_.expire
        );
        var controller_ = this.Make_alarm_secondDouble_controller(data_.num);
      }
      return React.createElement(
        "div",
        {
          key: index_,
          className:
            "userinfo_alarm_container inline_container content_preshow_container",
        },
        content_,
        controller_
      );
    }
  };
}
//==========================================================
function UserinfoNamespace(userinfo_arr_) {
  return class extends React.Component {
    constructor() {
      super();
      this.state = {
        name2: userinfo_arr_[3],
        phone: userinfo_arr_[4],
        place: Util_.category_to_string("place", userinfo_arr_[5]),
        agency: userinfo_arr_[6],
        field: Util_.category_to_string("field", userinfo_arr_[7]),
      };
      this.popup_confirm_data = [];
      this.ClickedUserinfo = null;
    }
    change_state(index_, e) {
      this.popup_confirm_data[index_] = e.target.value;
    }

    async req_change_userinfo(data_) {
      console.log('버튼 클릭')
      console.log('데이터 : ',data_)
      var to_server_ = {
        user: DataInfo.return_user_num(),
        id: data_.input_id,
        pw: data_.input_pw,
        law_num: data_.input_lawnum,
        data: data_.popup_data,
        info_index: this.ClickedUserinfo,
      };
      if (this.ClickedUserinfo == 3)
        to_server_.data = [
          data_.popup_data[0],
          data_.popup_data[1],
        ];
      else if (this.ClickedUserinfo === 4 || this.ClickedUserinfo === 6) to_server_.data = data_.popup_data[0];
      else if (this.ClickedUserinfo == 10) to_server_.data = true;
      var mesg_ = await check_form_req_change_userinfo(to_server_);
      if (!mesg_.success) {
        Popup.Create_popup(null, mesg_.message, "창닫기");
        return;
      }
      var from_server_ = await Util_.cli_to_server(
        "/change_userinfo/change_userinfo",
        to_server_,
        "POST"
      );
      if (from_server_.success) {
        if (this.ClickedUserinfo == 1) this.state.name2 = to_server_.data;
        else if (this.ClickedUserinfo == 2) this.state.phone = to_server_.data;
        else if (this.ClickedUserinfo == 4)
          this.state.place = Util_.category_to_string("place", to_server_.data);
        else if (this.ClickedUserinfo == 5) this.state.agency = to_server_.data;
        else if (this.ClickedUserinfo == 6)
          this.state.field = Util_.category_to_string("field", to_server_.data);
        this.setState(this.state);
      }
      Popup.Create_popup(null, from_server_.message, "창닫기");
      this.ClickedUserinfo = null;
    }
    async action_click_change(type_) {
      this.ClickedUserinfo = type_;
      var popup_content_ =await Popup_content_changeinfo(type_);
      if (type_ == 1) var popup_title_ = "닉네임 변경";
      else if (type_ == 2) var popup_title_ = "휴대번호 변경";
      else if (type_ == 3) var popup_title_ = "비밀번호 변경";
      else if (type_ == 4) var popup_title_ = "지역 변경";
      else if (type_ == 5) var popup_title_ = "소속 변경";
      else if (type_ == 6) var popup_title_ = "전문분야 변경";
      else if (type_ == 10) var popup_title_ = "정말로 탈퇴하시겠습니까?";
      Popup.Create_popup(
         popup_title_,
         popup_content_,
         "취소",
         "확인",
         this.req_change_userinfo.bind(this)
       );
     }
   
    render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "userinfo_section_container" },
          React.createElement(
            "div",
            { className: "normal_text" },
            `${userinfo_arr_[0]} 변호사님`
          ),
          React.createElement(
            "div",
            { className: "normal_text date_text_color" },
            `가입일 ${Util_.make_date_format(userinfo_arr_[8],2)} / ${userinfo_arr_[1]}년도에 등록`
          )
        ),
        React.createElement(
          "div",
          { className: "userinfo_section_container inline_container" },
          React.createElement(
            "div",
            { className: "userinfo_section normal_text inline_container" },
            React.createElement("div", null, "이메일"),
            React.createElement("div", null, userinfo_arr_[2])
          ),
          React.createElement(
            "div",
            { className: "userinfo_section inline_container" },
            React.createElement("div", null, "비밀번호"),
            React.createElement("div", null, "**************"),
            React.createElement(
              "div",
              {
                className: "button_confirm button_style1",
                onClick: this.action_click_change.bind(this, 3),
              },
              "변경하기"
            )
          ),
          React.createElement(
            "div",
            {
              id: "userinfo_nickname",
              className: "userinfo_section inline_container",
            },
            React.createElement("div", null, "닉네임"),
            React.createElement("div", null, this.state.name2),
            React.createElement(
              "div",
              {
                className: "button_confirm button_style1",
                onClick: this.action_click_change.bind(this, 1),
              },
              "변경하기"
            )
          ),
          React.createElement(
            "div",
            {
              id: "userinfo_tel",
              className: "userinfo_section inline_container",
            },
            React.createElement("div", null, "전화번호"),
            React.createElement("div", null, this.state.phone),
            React.createElement(
              "div",
              {
                className: "button_confirm button_style1",
                onClick: this.action_click_change.bind(this, 2),
              },
              "변경하기"
            )
          ),
          React.createElement(
            "div",
            {
              id: "userinfo_place",
              className: "userinfo_section inline_container",
            },
            React.createElement("div", null, `지역 ${this.state.place}`),
            React.createElement(
              "div",
              {
                className: "button_confirm button_style1",
                onClick: this.action_click_change.bind(this, 4),
              },
              "변경하기"
            )
          ),

          React.createElement(
            "div",
            {
              id: "userinfo_agent",
              className: "userinfo_section inline_container",
            },
            React.createElement("div", null, `소속 ${this.state.agency}`),
            React.createElement(
              "div",
              {
                className: "button_confirm button_style1",
                onClick: this.action_click_change.bind(this, 5),
              },
              "변경하기"
            )
          ),
          React.createElement(
            "div",
            {
              id: "userinfo_category",
              className: "userinfo_section inline_container",
            },
            React.createElement("div", null, "전문분야"),
            React.createElement("div", null, this.state.field),
            React.createElement(
              "div",
              {
                className: "button_confirm button_style1",
                onClick: this.action_click_change.bind(this, 6),
              },
              "변경하기"
            )
          ),
          React.createElement(
            "div",
            {
              id: "userinfo_agent",
              className: "userinfo_section inline_container",
            },
            React.createElement("div", null, `탈퇴하기`),
            React.createElement(
              "div",
              {
                className: "button_confirm button_style1",
                onClick: this.action_click_change.bind(this, 10),
              },
              "탈퇴하기"
            )
          )
        )
      );
    }
  };
}

class Change_userinfo extends React.Component {
  constructor() {
    super();
    this.state = {
      top_button_class: [
        "change_userinfo_menu_category",
        "change_userinfo_menu_category userinfo_menu_click",
      ],
    };
    this.offset = 0;
  }
  async get_more_data() {
    var from_server_ = await Util_.cli_to_server(
      "/change_userinfo/req_alarm_preshow",
      { user: DataInfo.return_user_num(), offset: this.offset },
      "POST"
    );
    if (!from_server_.success) return false;
    DataInfo.set_page_value(
      "ResArr",
      DataInfo.get_page_memmory("ResArr").concat(from_server_.message)
    );
    this.sendData.offset = this.sendData.offset + from_server_.message.length;
    return this.sendData.offset;
  }
  async req_alarm_preshow() {
    try {
      this.offset = 0;
      var from_server_ = await Util_.cli_to_server(
        "/change_userinfo/req_alarm_preshow",
        { user: DataInfo.return_user_num(), offset: this.offset },
        "POST"
      );
      if (!from_server_.success) {
        Util_.make_element(
          "div",
          "change_userinfo_mid",
          null,
          from_server_.message
        );
        return false;
      }
      DataInfo.set_page_value("ResArr", from_server_.message);
      Util_.make_element(
        MakeContentList(
          { get_more_data: this.get_more_data.bind(this) },
          UserAlarmNamespace
        ),
        "change_userinfo_mid"
      );
    } catch (err) {
      console.log("Error : ", err);
      Util_.make_element(
        "div",
        "change_userinfo_mid",
        null,
        "클라이언트 error: 서버와 통신에 실패하였습니다"
      );
    }
  }
  change_state(type_, e) {
    this.state[type_] = e.target.value;
    this.setState(this.state);
  }

  event_userInfo_page(type_, val_, e) {
    if (type_ === "click_alarm_preshow") {
      this.req_alarm_preshow();
      this.state.top_button_class = [
        "change_userinfo_menu_category",
        "change_userinfo_menu_category userinfo_menu_click",
      ];
    } else if (type_ === "click_user_info") {
      Popup.Create_popup(
        "사용자 인증",
        Popup_content_userAuthentication,
        "취소",
        "확인",
        this.ready_userAuthentication.bind(this)
      );
      this.state.top_button_class = [
        "change_userinfo_menu_category userinfo_menu_click",
        "change_userinfo_menu_category",
      ];
    }
    this.setState(this.state);
  }

  async ready_userAuthentication(data_) {
    console.log(data_)
    var to_server_ = {
      user: DataInfo.return_user_num(),
      id: data_.input_id,
      pw: data_.input_pw,
      law_num: data_.input_lawnum,
    };

    var mesg_ = await check_form_Authentication(to_server_);
    if (!mesg_.success) {
      Popup.Create_popup(null, mesg_.message, "창닫기");
      return;
    }
    var from_server_ = await Util_.cli_to_server(
      "/change_userinfo/check_userAuthentication",
      to_server_,
      "POST"
    );
    if (from_server_.success) {
      from_server_ = from_server_.message[0];
      from_server_ = [
        from_server_.name1,
        from_server_[Util_.dbdi("date_a")],
        from_server_.email,
        from_server_.name2,
        from_server_[Util_.dbdi("phone")],
        from_server_[Util_.dbdi("place")],
        from_server_[Util_.dbdi("agency")],
        from_server_[Util_.dbdi("field")],
        from_server_.date
      ];
      Popup.Action_cancel_button();
      Util_.make_element(
        UserinfoNamespace(from_server_),
        "change_userinfo_mid"
      );
    } else Popup.Create_popup(null, from_server_.message, "창 닫기");
  }
  componentDidMount() {
    if (DataInfo.return_page_num() != 4) {
      console.log("not page 4, re init");
      this.props.page_move(4, "My Page", false, false);
    }
    DataInfo.init_page_memory({
      ResArr: null,
      ShowingPage: { now: 0, end: null },
      ShowingContent: null,
      ShowingContentNum: null,
      SelectedCategory: {
        index: 5,
        selector: Util_.dbdi("num"),
      },
    });
    this.req_alarm_preshow();
  }
  render() {
    return (
      <div id="change_user_info">
        <div id="change_userinfo_top">
          <img id="change_userinfo_top_img" src={userinfo_back_img}></img>
          <div id="change_userinfo_top_profile" className="inline_container">
            <img id="change_userinfo_user_img" src={user_img}></img>
            <div id="user_profile_text" className="normal_text">
              {DataInfo.return_user_num("NAME")} 변호사님
            </div>
          </div>
          <div id="change_userinfo_top_menu" className="inline_container">
            <div
              className={this.state.top_button_class[0]}
              onClick={this.event_userInfo_page.bind(
                this,
                "click_user_info",
                0
              )}
            >
              유저정보
            </div>
            <div
              className={this.state.top_button_class[1]}
              onClick={this.event_userInfo_page.bind(
                this,
                "click_alarm_preshow",
                1
              )}
            >
              알 림
            </div>
          </div>
        </div>
        <div id="change_userinfo_mid"></div>
      </div>
    );
  }
}

export default withRouter(Change_userinfo);
