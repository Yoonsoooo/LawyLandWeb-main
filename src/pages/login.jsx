import React, { Fragment } from "react";
import Util_ from "./class/GlobalFtn";
import Popup from "./class/Popup";
import check from "./class/CheckForm";
import "../stylesheets/login.css";
import Term from "./class/term_text";

import sign_img from "../images/signtitle.png";
import find_img from "../images/findtitle.png";
import login_img from "../images/logintitle.png";

import { withRouter } from "react-router-dom";

async function check_form_register(data_, ftn_ = null) {
  if (!check.isEmailForm(data_.id))
    return { success: false, message: "잘못된 이메일형식입니다" };
  else if (!check.isPwForm(data_.pw))
    return { success: false, message: "비밀번호는 8자 이상 필요" };
  else if (data_.pw != data_.pw_check)
    return { success: false, message: "비밀번호와 확인이 같지 않습니다" };
  else if (!check.isLawnumForm(data_.law_num))
    return { success: false, message: "잘못된 변호사번호형식입니다" };
  else if (!check.isPhoneForm(data_.phone))
    return {
      success: false,
      message: "휴대번호 10자리 또는 11자리 숫자를 입력해주세요.('-' 제외)",
    };
  else {
    if (ftn_) ftn_({ success: true, message: null });
    else return { success: true, message: null };
  }
}

async function check_form_additional(data_, ftn_ = null) {
  if (!check.isNameForm(data_.name1))
    return { success: false, message: "잘못된 이름형식입니다" };
  else if (!check.isName2Form(data_.name2))
    return { success: false, message: "잘못된 닉네임형식입니다" };
  else if (!check.iscAquisitionForm(data_.acquisition))
    return { success: false, message: "잘못된 등록 연도입니다" };
  else if (!check.isPlaceNum(data_.place))
    return { success: false, message: "잘못된 지역선택입니다" };
  else if (!check.isFieldNum(data_.field))
    return { success: false, message: "잘못된 전문분야 선택입니다" };
  else if (!check.isAgencyLength(data_.agency))
    return { success: false, message: "소속 기관/단체의 이름 15자 내외" };
  else {
    if (ftn_) ftn_({ success: true, message: null });
    else return { success: true, message: null };
  }
}

async function check_form_request_find(data_, ftn_ = null) {
  if (data_.type === 0) {
    if (!check.isString(data_.law_num)) {
      return { success: false, message: "잘못된 LAW_NUM 형식 입니다" };
    }
    if (!check.isPhoneForm(data_.phone)) {
      return {
        success: false,
        message: "휴대번호 10자리 또는 11자리 숫자를 입력해주세요.('-' 제외)",
      };
    }
    if (!check.isNameForm(data_.name)) {
      return { success: false, message: "잘못된 이름 형식 입니다" };
    }
    if (ftn_) {
      ftn_({ success: true, message: null });
    }

    return { success: true, message: null };
  }

  if (data_.type === 1) {
    if (!check.isEmailForm(data_.id)) {
      return { success: false, message: "잘못된 ID 형식 입니다" };
    }
    if (!check.isString(data_.law_num)) {
      return { success: false, message: "잘못된 LAW_NUM 형식 입니다" };
    } else if (!check.isPhoneForm(data_.phone)) {
      return {
        success: false,
        message: "휴대번호 10자리 또는 11자리 숫자를 입력해주세요.('-' 제외)",
      };
    } else if (!check.isNameForm(data_.name)) {
      return { success: false, message: "잘못된 이름 형식 입니다" };
    } else {
      if (ftn_) ftn_({ success: true, message: null });
      else return { success: true, message: null };
    }
  }
}

async function check_form_check_id(data_, ftn_ = null) {
  if (!check.isEmailForm(data_.id)) {
    return { success: false, message: "잘못된 ID 형식 입니다" };
  } else {
    if (ftn_) ftn_({ success: true, message: null });
    else return { success: true, message: null };
  }
}

async function check_form_request_login(data_, ftn_ = null) {
  if (!check.isEmailForm(data_.id)) {
    return { success: false, message: "잘못된 ID 형식 입니다" };
  } else if (!check.isPwForm(data_.pw)) {
    return { success: false, message: "잘못된 PASSWORD 형식 입니다" };
  } else {
    if (ftn_) ftn_({ success: true, message: null });
    else return { success: true, message: null };
  }
}

class AutoLogin_component extends React.Component{
  constructor(props){
    super(props)
    this.state={
      last_login_: localStorage.getItem('tslkwq9330')?JSON.parse(localStorage.getItem('tslkwq9330')):false
    }
  }
  async action_click_container(){
    var temp_=this.state.last_login_.secure_card.substr(this.state.last_login_.cli_key1,6)
      +this.state.last_login_.secure_card.substr(this.state.last_login_.cli_key2,6)
      +this.state.last_login_.secure_card.substr(this.state.last_login_.cli_key3,6)
    Popup.Create_popup(null, "접속 중입니다... 종료하지 말아주세요.", "창닫기");
    var from_server_=await Util_.cli_to_server(
      "/login/request_autologin",
      {uid:this.state.last_login_.uid, cli_card_res:temp_},
      "POST"
    );
    if(from_server_.success){
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          uid: from_server_.message.uid,
          user: from_server_.message.user,
          name: from_server_.message.name,
          field: from_server_.message.field,
          acquisition: from_server_.message.acquisition,
          place: from_server_.message.place,
          light_card: from_server_.message.light_card
        })
      );
      localStorage.setItem('tslkwq9330',JSON.stringify({
        uid:this.state.last_login_.uid,
        cli_key1:from_server_.message.last_key1,
        cli_key2:from_server_.message.last_key2,
        cli_key3:from_server_.message.last_key3,
        name:from_server_.message.name,
        secure_card:this.state.last_login_.secure_card
      }))
      //=========================
      Popup.Create_popup(
        null,
        "로그인 성공, 메인페이지로 이동합니다.",
        "창닫기"
      );
      window.parent.postMessage("true");
      this.props.history.push("/homepage/home");
    } else
      Popup.Create_popup(
        null,
        'ID와 PW를 다시 입력해 주세요.',
        "창닫기"
      );
  }
  action_delete_container(){
    localStorage.removeItem('tslkwq9330')
    Popup.Create_popup(null,'로그인 기록을 삭제했습니다.','창닫기')
    this.setState({last_login_:null})
  }
  render(){
    let ele_=null
    if(this.state.last_login_)
      ele_=<div id='login_history_container' className='login_input_button inline_container'>
      <div onClick={this.action_click_container.bind(this)}>{this.state.last_login_.name} 변호사님</div>
      <div onClick={Popup.Create_popup.bind(this,null,'해당 로그인 기록을 삭제하시겠습니까?','아니요','네', this.action_delete_container.bind(this))}>
        | X
      </div>
    </div>
    else
      ele_=null
    return(
      <div>{ele_}</div>
    )
  }
}

class Popup_content_terms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term_check1: false,
      term_check2: false,
      term_class1: "terms_container_text terms_title_text",
      term_class2: "terms_container_text terms_title_text",
    };
    this.term1_checked = false;
    this.term2_checked = false;
  }

  terms_toggle(type_) {
    if (type_ == 1) {
      if (this.state.term_class1 == "terms_container_text terms_title_text")
        this.state.term_class1 = "terms_container_text_active terms_title_text";
      else if (
        this.state.term_class1 == "terms_container_text_active terms_title_text"
      )
        this.state.term_class1 = "terms_container_text terms_title_text";
    } else if (type_ == 2) {
      if (this.state.term_class2 == "terms_container_text terms_title_text")
        this.state.term_class2 = "terms_container_text_active terms_title_text";
      else if (
        this.state.term_class2 == "terms_container_text_active terms_title_text"
      )
        this.state.term_class2 = "terms_container_text terms_title_text";
    }
    this.setState(this.state);
  }
  click_checkbox(type_, e) {
    this.props.set_state(type_, e.target.checked);
  }
  render() {
    return (
      <div id="terms">
        <div className="terms_container">
          <div id="terms_1" className="terms_container_title inline_container">
            <input
              type="checkbox"
              className="popup_confirm_data"
              onClick={this.click_checkbox.bind(this, "term_check1")}
            />
            <label className="terms_title_text">이용약관 동의</label>
            <div
              className="terms_title_text"
              onClick={this.terms_toggle.bind(this, 1)}
            >
              자세히 보기
            </div>
          </div>
          <div className={this.state.term_class1}>
            {Util_.text_with_newline(Term.term_text1_())}
          </div>
        </div>

        <div className="terms_container">
          <div id="terms_2" className="terms_container_title inline_container">
            <input
              type="checkbox"
              className="popup_confirm_data"
              onClick={this.click_checkbox.bind(this, "term_check2")}
            />
            <label className="terms_title_text">개인정보 처리방침 동의</label>
            <div
              className="terms_title_text"
              onClick={this.terms_toggle.bind(this, 2)}
            >
              자세히 보기
            </div>
          </div>
          <div className={this.state.term_class2}>
            {Util_.text_with_newline(Term.term_text2_())}
          </div>
        </div>
      </div>
    );
  }
}
//--------
function LoginContentLogin(props) {
  function popup_warning(e){
    if(e.target.checked) 
      Popup.Create_popup("주의","신뢰 가능한 기기에서 선택해 주세요.",'창닫기')
    props.event_login_page(
      "set_auto_login",
      null,
      e.target.checked
    )
  }
  return React.createElement(
    "div",
    { id: "login_content" },
    React.createElement(
      "div",
      { id: "main_ele" },
      React.createElement("img", {
        id: "login_title",
        src: login_img,
      }),
      React.createElement(AutoLogin_component, {history:props.history}),
      React.createElement(
        "div",
        { id: "login_input" },
        React.createElement("input", {
          id: "input_id",
          className: "confirm_data",
          type: "text",
          placeholder: "아이디(이메일) 입력",
          onChange: props.event_login_page.bind(
            this,
            "change_login_input",
            "id"
          ),
        }),
        React.createElement("input", {
          id: "input_pw",
          className: "confirm_data",
          type: "password",
          placeholder: "패스워드 입력",
          onChange: props.event_login_page.bind(
            this,
            "change_login_input",
            "pw"
          ),
        }),
        React.createElement("div",{id:'login_checkbox_container'},
          React.createElement(
            "label",null,
            React.createElement("input",{type: "checkbox", onChange:popup_warning.bind(this)}),
            React.createElement(
              "span",{id:'auto_login_text'},"자동로그인"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "inline_container" },
          React.createElement(
            "div",
            {
              className: "button_login normal_text_login_login underLine_text",
              onClick: props.check_login.bind(this),
            },
            "로그인"
          ),
          React.createElement(
            "div",
            {
              className: "button_login normal_text_login_login underLine_text",
              onClick: props.event_login_page.bind(this, "move_page", 1),
            },
            "계정 찾기"
          )
        )
      )
    ),
    React.createElement(
      "div",
      {
        className: "button_whitebar inline_container",
        onClick: props.event_login_page.bind(this, "register_user", null),
      },
      React.createElement(
        "div",
        { className: "normal_text_login_login" },
        "가입이 필요하신가요?"
      ),
      React.createElement(
        "div",
        { className: "normal_text_login_login" },
        "Sign up"
      )
    )
  );
}

function LoginContentForgot(props) {
  return React.createElement(
    "div",
    { id: "login_content" },
    React.createElement(
      "div",
      { id: "main_ele" },
      React.createElement("img", {
        id: "find_title",
        src: find_img,
      }),
      React.createElement(
        "div",
        { id: "login_find_id" },
        React.createElement("div", { className: "find_label" }, "아이디 찾기"),
        React.createElement("input", {
          className: "confirm_data",
          type: "text",
          placeholder: "이름입력",
          onChange: props.event_login_page.bind(
            this,
            "change_find_input",
            "name"
          ),
        }),
        React.createElement("input", {
          className: "confirm_data",
          type: "text",
          placeholder: "변호사 등록번호 5자리 입력",
          onChange: props.event_login_page.bind(
            this,
            "change_find_input",
            "law_num"
          ),
        }),
        React.createElement("input", {
          className: "confirm_data",
          type: "text",
          placeholder: "전화번호 입력('-'없이)",
          onChange: props.event_login_page.bind(
            this,
            "change_find_input",
            "phone"
          ),
        }),
        React.createElement(
          "div",
          {
            className: "normal_text_login underLine_text",
            onClick: props.event_login_page.bind(this, "action_find", 0),
          },
          "아이디 찾기"
        )
      ),
      React.createElement(
        "div",
        { id: "login_find_pw", style: { marginBottom: "15px" } },
        React.createElement(
          "div",
          { className: "find_label" },
          "비밀번호 찾기"
        ),
        React.createElement("input", {
          className: "confirm_data",
          type: "text",
          placeholder: "아이디(이메일) 입력",
          onChange: props.event_login_page.bind(
            this,
            "change_find_input",
            "id"
          ),
        }),
        React.createElement("input", {
          className: "confirm_data",
          type: "text",
          placeholder: "이름입력",
          onChange: props.event_login_page.bind(
            this,
            "change_find_input",
            "name"
          ),
        }),
        React.createElement("input", {
          className: "confirm_data",
          type: "text",
          placeholder: "변호사 등록번호 5자리 입력",
          onChange: props.event_login_page.bind(
            this,
            "change_find_input",
            "law_num"
          ),
        }),
        React.createElement("input", {
          className: "confirm_data",
          type: "text",
          placeholder: "전화번호 입력('-'없이)",
          onChange: props.event_login_page.bind(
            this,
            "change_find_input",
            "phone"
          ),
        }),
        React.createElement(
          "div",
          {
            className: "normal_text_login underLine_text",
            onClick: props.event_login_page.bind(this, "action_find", 1),
          },
          "비밀번호 찾기"
        )
      ),
      React.createElement(
        "div",
        {
          className: "normal_text_login underLine_text",
          onClick: props.event_login_page.bind(this, "move_page", 0),
        },
        "로그인 페이지"
      )
    ),
    React.createElement(
      "div",
      {
        className: "button_whitebar inline_container",
        onClick: props.event_login_page.bind(this, "register_user", null),
      },
      React.createElement(
        "div",
        { className: "normal_text_login" },
        "가입이 필요하신가요?"
      ),
      React.createElement("div", { className: "normal_text_login" }, "Sign up")
    )
  );
}

function LoginContentRegister(props) {
  return React.createElement(
    "div",
    { id: "login_content" },
    React.createElement(
      "div",
      { id: "main_ele" },
      React.createElement("img", {
        id: "register_title",
        src: sign_img,
      }),
      React.createElement("input", {
        type: "text",
        className: "confirm_data",
        placeholder: "아이디(이메일) 입력",
        onChange: props.change_input_state.bind(this, "id"),
      }),
      React.createElement(
        "div",
        { id: "email_certification" },
        React.createElement(
          "div",
          {
            className: "underLine_text",
            onClick: props.event_login_page.bind(this, "check_id", null),
          },
          "인증번호 요청"
        ),
        React.createElement("input", {
          type: "text",
          className: "confirm_data",
          placeholder: "이메일 인증 번호",
          onChange: props.change_input_state.bind(this, "certification_num"),
        })
      ),
      React.createElement("input", {
        type: "password",
        className: "confirm_data",
        placeholder: "패스워드 입력",
        onChange: props.change_input_state.bind(this, "pw"),
      }),
      React.createElement("input", {
        type: "password",
        className: "confirm_data",
        placeholder: "패스워드 확인",
        onChange: props.change_input_state.bind(this, "pw_check"),
      }),
      React.createElement("input", {
        type: "text",
        className: "confirm_data",
        maxLength: 5,
        placeholder: "변호사등록번호 5자리 입력",
        onChange: props.change_input_state.bind(this, "law_num"),
      }),
      React.createElement("input", {
        type: "text",
        className: "confirm_data",
        maxLength: 11,
        placeholder: "휴대전화번호('-'없이)",
        onChange: props.change_input_state.bind(this, "phone"),
      }),
      React.createElement(
        "div",
        {
          className: "normal_text_login underLine_text",
          onClick: props.event_login_page.bind(this, "check_register"),
        },
        "다음으로"
      )
    ),
    React.createElement(
      "div",
      {
        className: "button_whitebar inline_container",
        onClick: props.event_login_page.bind(this, "move_page", 0),
      },
      React.createElement(
        "div",
        { className: "normal_text_login" },
        "이미 가입되어 있으신가요?"
      ),
      React.createElement("div", { className: "normal_text_login" }, "Sign in")
    )
  );
}
class LoginContentAdditional extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement(
      "div",
      { id: "login_content" },
      React.createElement(
        "div",
        { id: "main_ele" },
        React.createElement("img", {
          id: "register_title",
          src: sign_img,
        }),
        React.createElement("input", {
          type: "text",
          className: "confirm_data",
          placeholder: "이름 입력",
          onChange: this.props.change_input_state.bind(this, "name1"),
        }),
        React.createElement(
          "div",
          { id: "email_certification" },
          React.createElement("input", {
            type: "text",
            className: "confirm_data",
            placeholder: "닉네임 입력",
            onChange: this.props.change_input_state.bind(this, "name2"),
          }),
          React.createElement(
            "div",
            {
              className: "underLine_text",
              onClick: this.props.event_login_page.bind(this, "check_name2", null),
            },
            "닉네임 중복 확인"
          )
        ),
        React.createElement("input", {
          type: "number",
          className: "confirm_data",
          maxLength: 4,
          placeholder: "취득연도",
          onChange: this.props.change_input_state.bind(this, "acquisition"),
        }),
        React.createElement(
          "div",
          {
            id: "user_place",
            className: "login_input_button",
            onClick: this.props.event_login_page.bind(
              this,
              "select_place",
              null
            ),
          },
          this.props.place
        ),
        React.createElement("input", {
          type: "text",
          className: "confirm_data",
          placeholder: "소속(법인, 사무소) 입력",
          onChange: this.props.change_input_state.bind(this, "agency"),
        }),
        React.createElement(
          "div",
          {
            id: "user_field",
            className: "login_input_button",
            onClick: this.props.event_login_page.bind(
              this,
              "select_field",
              null
            ),
          },
          this.props.field
        ),
        React.createElement(
          "div",
          {
            className: "button_confirm normal_text_login underline_text",
            onClick: this.props.event_login_page.bind(
              this,
              "check_additional",
              null
            ),
          },
          "가입하기"
        )
      ),
      React.createElement(
        "div",
        {
          className: "button_whitebar inline_container",
          onClick: this.props.event_login_page.bind(this, "move_page", 0),
        },
        React.createElement(
          "div",
          { className: "normal_text_login" },
          "이미 가입되어 있으신가요?"
        ),
        React.createElement(
          "div",
          { className: "normal_text_login" },
          "Sign in"
        )
      )
    );
  }
}

class Login extends React.Component {
  constructor() {
    super();
    this.user_signup_input_ = {
      id: null,
      pw: null,
      pw_check: null,
      law_num: null,
      phone: null,
      name1: null,
      name2: null,
      acquisition: null,
      agency: null,
      place: null,
      field: null,
      certification_num: null,
    };
    this.find_input = { name: null, law_num: null, phone_num: null, id: null };
    this.login_input = { id: null, pw: null, is_auto_check:false };
    this.state = {
      term_class1: "terms_container_text terms_title_text",
      term_class2: "terms_container_text terms_title_text",
      field: "전문 분야",
      place: "소속 지역",
      page_num: 0,
    };
  }

  //----------------------------------
  reset_input() {
    this.state.term_class1 = "terms_container_text terms_title_text";
    this.state.term_class2 = "terms_container_text terms_title_text";
    this.state.field = "전문분야";
    this.state.place = "소속 지역";

    this.user_signup_input_.id = null;
    this.user_signup_input_.pw = null;
    this.user_signup_input_.pw_check = null;
    this.user_signup_input_.law_num = null;
    this.user_signup_input_.phone = null;
    this.user_signup_input_.name1 = null;
    this.user_signup_input_.name2 = null;
    this.user_signup_input_.acquisition = null;
    this.user_signup_input_.agency = null;
    this.user_signup_input_.place = null;
    this.user_signup_input_.field = null;
    this.user_signup_input_.certification_num = null;
    this.find_input.name = null;
    this.find_input.law_num = null;
    this.find_input.phone_num = null;
    this.find_input.id = null;
    this.login_input.id = null;
    this.login_input.pw = null;
    this.login_input.is_auto_check=false
  }
  change_input_state(type_, e) {
    this.user_signup_input_[type_] = e.target.value;
  }
  move_page(type_ = 0) {
    if (type_ == 0 || type_ == 1) this.reset_input();
    this.state.page_num = type_;
    this.setState(this.state);
  }

  action_move_to_additional() {
    this.move_page(3);
    Popup.Action_cancel_button();
  }
  action_select_field(popup_data_) {
    if (popup_data_.popup_data.length === 0) {
      Popup.Action_cancel_button();
      this.user_signup_input_.field = 0;
      this.setState({ field: "전문 분야" });
      return;
    }
    this.user_signup_input_.field = popup_data_.popup_data[0];
    Popup.Action_cancel_button();
    this.setState({
      field: popup_data_.popup_data[0]
        ? Util_.category_to_string("field", popup_data_.popup_data[0])
        : "전문 분야",
    });
    console.log(this.state);
  }
  action_select_place(popup_data_) {
    console.log("place: ", popup_data_);
    if (popup_data_.popup_data.length === 0) {
      Popup.Action_cancel_button();
      return;
    }
    this.user_signup_input_.place = popup_data_.popup_data[0];
    Popup.Action_cancel_button();
    this.setState({
      place: popup_data_.popup_data[0]
        ? Util_.category_to_string("place", popup_data_.popup_data[0])
        : "소속 지역",
    });
  }
  async action_click_find(action_type_) {
    if (action_type_ === 0) {
      var to_server_ = {
        type: action_type_,
        name: this.find_input.name,
        law_num: this.find_input.law_num,
        phone: this.find_input.phone,
      };

      //유효성 검사 type === 0
      var mesg_ = await check_form_request_find({
        type: action_type_,
        name: this.find_input.name,
        law_num: this.find_input.law_num,
        phone: this.find_input.phone,
      });
      if (!mesg_.success) {
        Popup.Create_popup(null, mesg_.message, "창닫기");
        return;
      }
    }
    if (action_type_ === 1) {
      var to_server_ = {
        type: action_type_,
        id: this.find_input.id,
        name: this.find_input.name,
        law_num: this.find_input.law_num,
        phone: this.find_input.phone,
      };
      //유효성 검사 type === 1
      var mesg_ = await check_form_request_find({
        type: action_type_,
        id: this.find_input.id,
        name: this.find_input.name,
        law_num: this.find_input.law_num,
        phone: this.find_input.phone,
      });
      if (!mesg_.success) {
        Popup.Create_popup(null, mesg_.message, "창닫기");
        return;
      }
    }

    var from_server_ = await Util_.cli_to_server(
      "/login/request_find",
      to_server_,
      "POST"
    );
    Popup.Create_popup(null, from_server_.message, "창닫기");
  }
  async check_id() {
    //유효성 검사
    this.user_signup_input_.id = this.user_signup_input_.id.replace(" ", "");
    var mesg_ = await check_form_check_id({ id: this.user_signup_input_.id });
    if (!mesg_.success) {
      Popup.Create_popup(null, mesg_.message, "창닫기");
      return;
    }

    var from_server_ = await Util_.cli_to_server(
      "/login/check_id",
      { id: this.user_signup_input_.id },
      "POST"
    );
    Popup.Create_popup(null, from_server_.message, "창닫기");
  }
  async check_login() {
    if (!this.login_input.id|| !this.login_input.pw) {
      Popup.Create_popup(null, "ID와 PW를 정확히 입력해 주세요.", "창닫기");
      return;
    }
    else if (this.login_input.id.length < 5 || this.login_input.pw.length < 5) {
      Popup.Create_popup(null, "ID와 PW를 정확히 입력해 주세요.", "창닫기");
      return;
    }
    this.login_input.id = this.login_input.id.replace(" ", "");
    this.login_input.pw = this.login_input.pw.replace(" ", "");
    Popup.Create_popup(null, "접속 중입니다...", "창닫기");
    //유효성 검사
    var mesg_ = await check_form_request_login(this.login_input);
    if (!mesg_.success) {
      Popup.Create_popup(null, mesg_.message, "창닫기");
      return;
    }

    var from_server_ = await Util_.cli_to_server(
      "/login/request_login",
      this.login_input,
      "POST"
    );
    console.log(from_server_);
    if (from_server_.success) {
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          uid: from_server_.message.uid,
          user: from_server_.message.user,
          name: from_server_.message.name,
          field: from_server_.message.field,
          acquisition: from_server_.message.acquisition,
          place: from_server_.message.place,
          light_card: from_server_.message.light_card
        })
      );
      //=====set auto login=======
      if(from_server_.set_flag){
        localStorage.setItem('tslkwq9330',JSON.stringify({
          uid:from_server_.message.uid,
          cli_key1:from_server_.message.last_key1,
          cli_key2:from_server_.message.last_key2,
          cli_key3:from_server_.message.last_key3,
          name:from_server_.message.name,
          secure_card:from_server_.message.secure_card
        }))
      }
      //=========================
      Popup.Create_popup(
        null,
        "로그인 성공, 메인페이지로 이동합니다.",
        "창닫기"
      );

      window.parent.postMessage("true");
      this.props.history.push("/homepage/home");
    } else
      Popup.Create_popup(
        null,
        "ID와 PW를 정확히 입력해 주세요.",
        "창닫기"
      );
  }
  async check_name2(){
    try{
      if(this.user_signup_input_.name2.length===0 || this.user_signup_input_.name2.length>16) return Popup.Create_popup(null,'닉네임은 16자 이내로 작성해 주세요.','창닫기')
      var from_server_= await Util_.cli_to_server('/login/check_name2',{name2:this.user_signup_input_.name2},'POST')
      Popup.Create_popup(null,from_server_.message,'창닫기')
    }catch(e){
      console.log(e);
    }
  }
  async check_register() {
    try {
      this.user_signup_input_.id = this.user_signup_input_.id.replace(" ", "");
      this.user_signup_input_.pw = this.user_signup_input_.pw.replace(" ", "");
      var mesg_ = await check_form_register({
        id: this.user_signup_input_.id,
        pw: this.user_signup_input_.pw,
        pw_check: this.user_signup_input_.pw_check,
        law_num: this.user_signup_input_.law_num,
        phone: this.user_signup_input_.phone,
        certification_num: this.user_signup_input_.certification_num,
      });
      if (!mesg_.success) {
        Popup.Create_popup(null, mesg_.message, "창닫기");
        return;
      } else {
        let from_server_ = await Util_.cli_to_server(
          "/login/request_register",
          {
            id: this.user_signup_input_.id,
            pw: this.user_signup_input_.pw,
            pw_check: this.user_signup_input_.pw_check,
            law_num: this.user_signup_input_.law_num,
            phone: this.user_signup_input_.phone,
            certification_num: this.user_signup_input_.certification_num,
          },
          "POST"
        );
        console.log("from_server : " + from_server_);
        if (from_server_.success) {
          Popup.Create_popup(
            null,
            "모두 확인하셨습니까?",
            "아니요",
            "네",
            this.action_move_to_additional.bind(this)
          );
        } else Popup.Create_popup(null, from_server_.message, "창닫기");
      }
    } catch (e) {
      console.log(e);
    }
  }
  async check_additional() {
    let mesg_ = await check_form_register(this.user_signup_input_);
    if (!mesg_.success) {
      Popup.Create_popup(null, mesg_.message, "창닫기");
      return;
    } else {
      mesg_ = await check_form_additional(this.user_signup_input_);
      if (!mesg_.success) {
        Popup.Create_popup(null, mesg_.message, "창닫기");
        return;
      } else {
        console.log(this.user_signup_input_);
        let from_server_ = await Util_.cli_to_server(
          "/login/request_additional",
          this.user_signup_input_,
          "POST"
        );
        if (from_server_.success) {
          this.move_page(0);
          Popup.Create_popup(null, "가입에 성공하셨습니다.", "창닫기");
        } else Popup.Create_popup(null, from_server_.message, "창닫기");
      }
    }
  }

  action_terms_confirm(popup_data_) {
    if (popup_data_.term_check1 && popup_data_.term_check2) {
      this.move_page(2);
      Popup.Action_cancel_button();
    }
  }
  make_terms_popup() {
    Popup.Create_popup(
      "회원 약관",
      Popup_content_terms,
      "취소",
      "동의",
      this.action_terms_confirm.bind(this)
    );
  }
  //==================================================================
  event_login_page(type_, val_, e) {
    if (type_ == "change_find_input") this.find_input[val_] = e.target.value;
    else if (type_ == "action_find") this.action_click_find(val_);
    else if (type_ == "change_login_input") this.login_input[val_] = e.target.value;
    else if(type_==='set_auto_login') this.login_input.is_auto_check= e
    else if (type_ == "action_login") this.check_login();
    else if (type_ == "move_page") this.move_page(val_);
    else if (type_ == "check_register") this.check_register();
    else if (type_ == "check_additional") this.check_additional();
    else if (type_ == "check_id") this.check_id();
    else if (type_ == "check_name2") this.check_name2();
    else if (type_ == "register_user") this.make_terms_popup();
    else if (type_ == "select_place") {
      Popup.Create_popup(
        "소속 지역",
        "place",
        "취소",
        "선택",
        this.action_select_place.bind(this),
        { max: 1, init_state: [this.user_signup_input_.place], start_index: 1 }
      );
    } else if (type_ == "select_field") {
      Popup.Create_popup(
        "전문 분야",
        "field",
        "취소",
        "선택",
        this.action_select_field.bind(this),
        { max: 1, init_state: [this.user_signup_input_.field], start_index: 0 }
      );
    }
  }
  //====================
  render() {
    let ele_ = null;
    if (this.state.page_num === 0)
      ele_ = (
        <LoginContentLogin
          event_login_page={this.event_login_page.bind(this)}
          check_login={this.check_login.bind(this)}
          history={this.props.history}
        />
      );
    else if (this.state.page_num === 1)
      ele_ = (
        <LoginContentForgot
          event_login_page={this.event_login_page.bind(this)}
        />
      );
    else if (this.state.page_num === 2)
      ele_ = (
        <LoginContentRegister
          event_login_page={this.event_login_page.bind(this)}
          change_input_state={this.change_input_state.bind(this)}
        />
      );
    else if (this.state.page_num === 3)
      ele_ = (
        <LoginContentAdditional
          event_login_page={this.event_login_page.bind(this)}
          change_input_state={this.change_input_state.bind(this)}
          field={this.state.field}
          place={this.state.place}
        />
      );

    return (
      <Fragment>
        <div id="popup_render_place" />
        <div id="login_mid">{ele_}</div>
      </Fragment>
    );
  }
}

export default withRouter(Login);
