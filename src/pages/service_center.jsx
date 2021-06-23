import "../stylesheets/service_center.css";
import React, { Fragment } from "react";
import check from "./class/CheckForm";
import ServiceCenterList from "./components/service_center/index.jsx";

import close_img from "../images/closeback.png";
import { withRouter } from "react-router-dom";

async function check_form_req_write(data_) {
  if (!check.isNumberRange(data_.title, 50)) {
    return { success: false, message: "잘못된 title 입니다" };
  }
  if (!check.isNumberRange(data_.content, 500)) {
    return { success: false, message: "잘못된 Content 입니다" };
  }

  return { success: true, message: null };
}

var test_ = [
  {
    num: 1,
    title: "'로이랜드'에 오신 것을 환영합니다.",
    content:
      "변호사의 시간과 비용을 줄여주는 변호사들의 놀이터, '로이랜드'에 오신 것을 환영합니다.\n'로이랜드'는 변호사의 친밀한 연결을 통해 상생과 협력, 시너지의 가치를 추구합니다.",
    is_comment: "21.05.11",
  },
  {
    num: 2,
    title: "2021년 5월 시스템 점검 안내",
    content:
      "안녕하십니까, 변호사들의 놀이터 로이랜드입니다.\n원활하고 안정된 서비스 제공을 위하여 2021년 5월 20일 시스템 점검 작업이 예정되어 있습니다.\n점검 시간 중 로이랜드의 모든 서비스가 중단될 예정이오니 이용에 불편 없으시기 바랍니다.",
    is_comment: "21.06.25",
  },
];
var ffq_ = [
  {
    num: 1,
    title: "법률Q/A는 어떻게 이용하나요?",
    content:
      "1. 질문하기\n① ‘글쓰기’를 click해주세요.\n② 익명으로 질문을 남기시려면 ‘익명 질문’에 체크해주세요.\n③ 분야를 반드시 선택해주세요. 분야는 최소 1개, 최대 3개 선택 가능합니다.\n④ 제목과 상세내용을 입력하신 후 ‘등록하기’를 click하시면 질문이 업로드됩니다.\n\n2. 답변하기\n① 댓글 입력창에 답변을 남겨주세요.\n② 익명으로 답변을 남기시려면 ‘익명’에 체크해주세요.\n③ ‘등록’을 click하시면 답변이 업로드됩니다.\n④ 업로드하신 질문은 ‘메뉴’→‘나의 이력’→‘나의 답글’에서 확인하실 수 있습니다.",
  },
  {
    num: 2,
    title: "복대리는 어떻게 이용하나요?",
    content:
      "1. 복대리 등록하기\n① ‘글쓰기’를 click해주세요.\n② ‘도시선택’을 click하신 후 복대리 지역을 선택하시면 해당 광역시의 법원을 선택하실 수 있습니다.\n③ 법정 호실을 입력해주세요.\n④ 기일을 선택해주세요. 당일 복대리인 경우 ‘긴급’을 체크하시면 리스트 최상단에 노출됩니다.\n⑤ 사건번호, 당사자명, 상대방, 금액, 사건개요, 전달사항을 차례로 입력해 주세요.\n⑥ ‘등록하기’를 클릭하시면 복대리가 업로드 됩니다.\n\n⑦ 등록하신 복대리는 ‘메뉴’→‘나의 이력’→‘나의 위임’에서 확인하실 수 있습니다.\n\n2. 복대리 신청하기\n① 리스트의 ‘신청하기’를 click해주세요.\n② 수임료 입금을 위한 계좌 정보를 입력해주시면 신청이 완료됩니다.\n③ 신청하신 복대리는 등록하신 복대리 ‘메뉴’→‘나의 이력’→‘나의 수임’에서 확인하실 수 있습니다.",
  },
  {
    num: 3,
    title: "글을 꼭 실명으로 작성해야 하나요?",
    content:
      "아닙니다.\n법률Q/A에서 질문이나 답변 시 익명으로 글을 작성하실 경우 ‘익명’에 체크해 주시면 회원 가입 시 등록하신 ‘닉네임’으로 글이 업로드됩니다.",
  },
  {
    num: 4,
    title: "복대리의 개인정보가 노출되지 않을까요?",
    content:
      "아닙니다.\n복대리는 ‘기일’, ‘법원’, ‘금액’의 정보만이 전체공개되고, 복대리 계약이 체결될 경우에만 수임 변호사분에게 당사자 및 사건 내용이 공개됩니다.",
  },
];
var qqa_ = [
  {
    num: 1,
    title: "title1",
    content: "content1",
    is_comment: "21.06.10",
  },
  {
    num: 2,
    title: "title2",
    content: "content2",
    is_comment: "21.11.04",
  },
  {
    num: 3,
    title: "title3",
    content: "content3",
    is_comment: "21.09.30",
  },
  {
    num: 4,
    title: "title4",
    content: "content4",
    is_comment: "21.03.23",
  },
];
class ServiceCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input_title: "",
      input_content: "",
      notice: false,
      faq: false,
      question: false,
      protest: false,
      questionData: null,
    };
    this.handleShowNotice = this.handleShowNotice.bind(this);
    this.handleShowFqa = this.handleShowFqa.bind(this);
    this.handleShowQuestion = this.handleShowQuestion.bind(this);
    this.handleShowProtest = this.handleShowProtest.bind(this);
    this.handleInputTitleChange = this.handleInputTitleChange.bind(this);
    this.handleInputContentChange = this.handleInputContentChange.bind(this);
    this.onClickWriteConfirm = this.onClickWriteConfirm.bind(this);
  }

  handleShowNotice() {
    this.setState((state) => ({
      notice: !state.notice,
    }));
  }

  handleShowFqa() {
    this.setState((state) => ({
      faq: !state.faq,
    }));
  }

  async handleShowQuestion() {
    this.setState((state) => ({
      question: !state.question,
    }));

    console.log(DataInfo.return_user_num());
  }

  handleShowProtest() {
    this.setState((state) => ({
      protest: !state.protest,
    }));
  }

  handleInputTitleChange(e) {
    this.setState({ input_title: e.target.value });
  }

  handleInputContentChange(e) {
    this.setState({ input_content: e.target.value });
  }

  async onClickWriteConfirm(e) {
    await fetch("/service_center/write_path", {
      method: "POST",
      body: JSON.stringify({
        user: DataInfo.return_user_num(),
        title: this.state.input_title,
        content: this.state.input_content,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cache: "no-cache",
      },
      //credentials: "same-origin"
      credentials: "include",
    })
      .then((res) => {
        res.json();
      })
      .then((response) => {
        console.log("Success:", JSON.stringify(response));

        this.setState({
          input_title: "",
          input_content: "",
        });

        this.handleShowProtest();
      })
      .catch((err) => {
        console.log("에러발생");
        console.log("err : ", err);
      });
  }

  componentDidMount() {
    if (DataInfo.return_page_num() != 3) {
      console.log("not page 3, re init");
      this.props.page_move(3, "고객센터", false, false);
    }

    return fetch("/service_center/req_complain_preshow", {
      method: "POST",
      body: JSON.stringify({
        user: DataInfo.return_user_num(),
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cache: "no-cache",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        this.setState({
          questionData: res.message,
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.protest !== prevState.protest) {
      return fetch("/service_center/req_complain_preshow", {
        method: "POST",
        body: JSON.stringify({
          user: DataInfo.return_user_num(),
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Cache: "no-cache",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          this.setState({
            questionData: res.message,
          });
          this.forceUpdate();
        });
    }
  }

  render() {
    const { notice, faq, question, protest } = this.state;

    return (
      <div id="service_center_mid">
        <div
          id="service_center_title"
          className="service_center_container content_preshow_container inline_container"
        >
          {!notice && !faq && !question && <p></p>}
          {notice && <p>공지사항</p>}
          {faq && <p>FAQ</p>}
          {question && !protest && <p>문의내역</p>}
          {protest && (
            <p>
              <img
                id="page_move_button"
                src={close_img}
                onClick={this.handleShowProtest}
              ></img>
              문의내역
            </p>
          )}
        </div>
        {notice ? (
          <div id="service_center_body">
            <div className="service_center_container content_preshow_container">
              <img
                id="page_move_button"
                src={close_img}
                onClick={this.handleShowNotice}
              ></img>
              <div id="board_top">고객센터</div>
            </div>
            {test_.map((val_, index_) => {
              return <ServiceCenterList index={index_} item={val_} sort={2} />;
            })}
          </div>
        ) : null}
        {faq ? (
          <div id="service_center_body">
            <div className="service_center_container content_preshow_container">
              <img
                id="page_move_button"
                src={close_img}
                onClick={this.handleShowFqa}
              ></img>
              <div id="board_top">고객센터</div>
            </div>
            {ffq_.map((val_, index_) => {
              return <ServiceCenterList index={index_} item={val_} sort={1} />;
            })}
          </div>
        ) : null}
        {question && !protest ? (
          <Fragment>
            <div id="service_center_body">
              <div className="service_center_container content_preshow_container">
                <img
                  id="page_move_button"
                  src={close_img}
                  onClick={this.handleShowQuestion}
                ></img>
                <div id="board_top">고객센터</div>
              </div>
              {this.state.questionData.map((val_, index_) => {
                return (
                  <ServiceCenterList index={index_} item={val_} sort={3} />
                );
              })}
            </div>
            <div
              id="write_confirm_button"
              className="button_style1"
              onClick={this.handleShowProtest}
            >
              문의하기
            </div>
          </Fragment>
        ) : null}
        {!notice && !faq && !question && (
          <div id="service_center_render_place">
            <div className="content_preshow_contain">
              <div className="button_style1" onClick={this.handleShowNotice}>
                공지사항
              </div>
              <div className="button_style1" onClick={this.handleShowFqa}>
                FAQ
              </div>
              <div className="button_style1" onClick={this.handleShowQuestion}>
                나의 문의 내역
              </div>
            </div>
          </div>
        )}
        {protest && (
          <div id="service_center_body">
            <div className="service_title content_preshow_container normal_text inline_container">
              <div className="inline_container content_preshow_container normal_text">
                <div className="complain_write_label">제목</div>
                <input
                  id="input_title"
                  className="input_style1 service_confirm_data place_right"
                  type="text"
                  placeholder="title"
                  value={this.state.input_title}
                  onChange={this.handleInputTitleChange}
                ></input>
              </div>
              <div className="inline_container content_preshow_container normal_text">
                <div className="complain_write_label">문의내용</div>
                <textarea
                  id="input_content"
                  className="textarea_style1 service_confirm_data"
                  value={this.state.input_content}
                  onChange={this.handleInputContentChange}
                ></textarea>
              </div>
            </div>
            <div
              id="write_confirm_button"
              className="button_style1"
              onClick={this.onClickWriteConfirm}
            >
              문의하기
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(ServiceCenter);
