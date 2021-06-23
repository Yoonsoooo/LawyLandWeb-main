import React from "react";
import  Util_ from './class/GlobalFtn';
import Term from "./class/term_text";
import "../stylesheets/about.css"
import logo_img from "../images/logo.png"
import QA_img from "../images/QA.png"
import substitution_img from "../images/substitution.png"
import Law_img from "../images/Law.png"
import coprosperity_img from "../images/co-prosperity.png"
import connection_img from "../images/Connection.png"
import cynergy_img from "../images/cynergy.png"
import made_by_Artist_Mind from "../images/Artist_Mind.png"
var e_ = React.createElement;

class About extends React.Component {
  constructor(props) {
    super(props);
    if(DataInfo.return_page_num()!=2){
      console.log('not page 2, re init')
      this.props.page_move(2,'About 로이랜드', false, false)
  }
  }

  render() {
    return e_(
      "div",
      { className: "my-8" },
      e_(introduce),
      // e_('div', {}, '이용방법'),
      e_(TermsOfService),
      e_(PrivacyPolicy)
    );
  }
}

function introduce() {
  return e_(
    "div",
    { className: "h-auto  flex flex-col flex-1 m-2 my-8" },
    e_(
      "p",
      { className: "text-3xl mt-4 m-7 font-medium" },
      "변호사들의 친밀한 연결로 상생의 시너지를 공유합니다. 변호사의 시간과 비용을 절감하는 신속하고 효율적인 리걸테크를 제공합니다."
      )
    ),
    e_(
      "p",
      { className: "text_message10" },
      Util_.text_with_newline('OUR SERVICE'),
      e_(
        "img",
        { className: "QA_img", src: QA_img }
      ),
      e_(
        "p",
        { className: "text_message0" },
        Util_.text_with_newline('법률Q/A')),
        e_(
          "p",
          { className: "text_message01" },
          Util_.text_with_newline('송무에서 사무실 운영,\n취미에서 맛집까지\n지식과 경험을 공유하세요.')),
          e_(
            "img",
            { className: "substitution_img", src: substitution_img }
          ),
        e_(
          "p",
          { className: "text_message1" },
          Util_.text_with_newline('복대리')),
          e_(
            "p",
            { className: "text_message11" },
            Util_.text_with_newline('카톡으로 전화로,\n인맥 복대리는 그만\n전국 변호사들과\n원스톱 비대면\n복대리계약을 체결하세요.')),
            e_(
              "img",
              { className: "Law_img", src: Law_img }
            ),
      e_(
        "p",
        { className: "text_message2" },
        Util_.text_with_newline('LAW리포터')),
        e_(
          "p",
          { className: "text_message22" },
          Util_.text_with_newline('새로 발의되는 법령\n그 배경과 내용, 이면과 문제점을\n모두 확인하세요.')),
      e_(
        "p",
        { className: "text_message3" },
        Util_.text_with_newline('OUR Directivity')),
        e_(
          "img",
          { className: "coprosperity_img", src: coprosperity_img }
        ),
      e_(
        "p",
        { className: "text_message4" },
        Util_.text_with_newline('상생')),
        e_(
          "p",
          { className: "text_message44" },
          Util_.text_with_newline('로이랜드를 경쟁의 서바이벌이 아닌\n연결과 상생의 가치를 추구합니다.')),
          e_(
            "img",
            { className: "connection_img", src: connection_img }
          ),
      e_(
        "p",
        { className: "text_message5" },
        Util_.text_with_newline('협력')),
        e_(
          "p",
          { className: "text_message55" },
          Util_.text_with_newline('로이랜드는 지역 분야 성 연령의\n한계를 뛰어넘는\n협력의 가치를 추구합니다.')),
          e_(
            "img",
            { className: "cynergy_img", src: cynergy_img }
          ),
      e_(
        "p",
        { className: "text_message6" },
        Util_.text_with_newline('시너지')),
        e_(
          "p",
          { className: "text_message66" },
          Util_.text_with_newline('로이랜드는 리걸테크를 통한\n더 나은 가치창출의 시너지를\n추구합니다.')),
        e_(
          "img",
          { className: "logo", src: logo_img }
        ),
      e_(
        "p",
        { className: "text_message7" },
        Util_.text_with_newline('BI(Business Intelligence)'),
        e_(
          "p",
          { className: "text_message77" },
          Util_.text_with_newline('소개 상생, 시너지와 발전, 협력을\n손을 포개는 이미지를\n모티브한 로고 입니다.'),
        e_(
          "p",
          { className: "text_message_green" },
          '상생(green), '),
        e_(
          "p",
          { className: "text_message_yellow" },
          '시너지/발전(yellow),'),
        e_(
          "p",
          { className: "text_message_blue" },
          '협력(blue)'),
        e_(
          "p",
          { className: "text_message78" },
          Util_.text_with_newline('의 컬러로\n삼권분립과 법조삼륜의 의미를 상징하며,\n무한한 수의 상징인 원을 이용하여\n무한한 가능성을\n은유적으로 디자인 하였습니다.'),
      e_(
        "img",
        { src: made_by_Artist_Mind, className: "Artist_Mind_img" },
  )))))
}

class TermsOfService extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isTeamsOfServiceOpen: false,
    };
  }

  onDtailClick() {
    this.setState(
      {
        isTeamsOfServiceOpen: !this.state.isTeamsOfServiceOpen,
      },
      () => console.log(this.state.isTeamsOfServiceOpen)
    );
  }

  render() {
    return e_(
      "div",
      {
        className:
          this.state.isTeamsOfServiceOpen === false
            ? "transition-height duration-500 ease-in-out h-auto bg-white flex flex-col flex-1 m-2 my-8"
            : "transition-height duration-500 ease-in-out h-auto bg-white flex flex-col flex-1 m-2 my-8",
      },
      e_(
        "p",
        { className: "text-center text-3xl mt-4 font-black" },
        "이용약관"
      ),
      this.state.isTeamsOfServiceOpen === false
        ? e_(
            "p",
            {
              className:
                "transition-opacity duration-500 ease-out opacity-100 text-center mt-4 m-7",
            },
            "기존 팀에 합류하는 사용자에게 적용되는 계약"
          )
        : e_(
            "p",
            {
              className:
                "transition-opacity duration-500 ease-out opacity-100 text-center mt-4 m-7",
            },
            Util_.text_with_newline(Term.term_text1_())
          ),
      e_(
        "button",
        {
          className:
            "h-11 w-full bg-blue-500 mt-6 text-white font-medium mt-auto",
          onClick: (e) => this.onDtailClick(),
        },
        "자세히보기"
      )
    );
  }
}

class PrivacyPolicy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPrivacyPolicyOpen: false,
    };
  }

  onDtailClick() {
    this.setState(
      {
        isPrivacyPolicyOpen: !this.state.isPrivacyPolicyOpen,
      },
      () => console.log(this.state.isPrivacyPolicyOpen)
    );
  }

  render() {
    return e_(
      "div",
      {
        className:
          this.state.isPrivacyPolicyOpen === false
            ? "transition-height duration-500 ease-in-out h-auto bg-white flex flex-col flex-1 m-2"
            : "transition-height duration-500 ease-in-out h-auto bg-white flex flex-col flex-1 m-2",
      },
      e_(
        "p",
        { className: "text-center text-3xl mt-4 font-black" },
        "개인정보처리법칙"
      ),
      this.state.isPrivacyPolicyOpen === false
        ? e_(
            "p",
            {
              className:
                "transition-opacity duration-500 ease-out opacity-100 mt-4 m-7",
            },
            "로이랜드가 수집하는 정보, 로이랜드가 그러한 정보를 사용하는 방법 및 귀하에게 부여되는 선택권에 관한 로이랜드의 개인정보 보호 정책을 소개합니다"
          )
        : e_(
            "p",
            {
              className:
                "transition-opacity duration-500 ease-out opacity-100 mt-4 m-7",
            },
            Util_.text_with_newline(Term.term_text2_())
          ),
      e_(
        "button",
        {
          className: "h-11 w-full bg-yellow-300 mt-6 font-medium mt-auto",
          onClick: (e) => this.onDtailClick(),
        },
        "자세히보기"
      )
    );
  }
}

export default About;
