import "../stylesheets/view_results.css";
import React from "react";
import ModalPortal from "./components/view_results/ModalPortal.jsx";
import ViewResultsFinishedModal from "./components/view_results/ViewResultsFinishedModal.jsx";
import Attendee from "./components/view_results/Attendee.jsx";
import ContentsOfDefense from "./components/view_results/ContentsOfDefense.jsx";
import OtherThings from "./components/view_results/OtherThings.jsx";
import PlaceModal from "./components/view_results/PlaceModal.jsx";
import Util_ from "./class/GlobalFtn";
import Popup from "./class/Popup";
import category from "./write_double_agent_context";

import { withRouter } from "react-router-dom";
class ViewResults extends React.Component {
  constructor(props) {
    super(props);
    if (DataInfo.return_page_num() != 10) {
      console.log("not page 10, re init");
      this.props.page_move(5, "나의 이력", false);
      return;
    }
    this.props.set_title("결과통지서 작성");
    this.state = {
      category,
      num: DataInfo.get_public_memmory()?.num,
      isModalViewOpen: false,
      attendee: null,
      contentsOfdefense: null,
      otherSide: null,
      dateOfNextHearing: [null, null, null, null, null],
      otherThings: null,
      city: null,
      court: null,
      place: null,
      loading: false,
    };

    this.Action_confirm_data = this.Action_confirm_data.bind(this);
    this.openModalView = this.openModalView.bind(this);
    this.closeModalView = this.closeModalView.bind(this);
    this.handleAttendeeChange = this.handleAttendeeChange.bind(this);
    this.handleContentsOfDefenseChange =
      this.handleContentsOfDefenseChange.bind(this);
    this.handleOtherSideChange = this.handleOtherSideChange.bind(this);
    this.handleDateOfNextHearingChange =
      this.handleDateOfNextHearingChange.bind(this);
    this.handleOtherThingsChange = this.handleOtherThingsChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleCourtChange = this.handleCourtChange.bind(this);
  }

  //새로 추가 부분 5/26
  Action_confirm_data = async () => {
    const { dateOfNextHearing } = this.state;

    if (
      this.state.attendee === null ||
      this.state.attendee === undefined ||
      this.state.attendee === ""
    ) {
      return Popup.Create_popup(null, "참석자를 정확히 입력해 주세요.", "창닫기");
    }

    if (
      this.state.contentsOfdefense === null ||
      this.state.contentsOfdefense === undefined ||
      this.state.contentsOfdefense === ""
    ) {
      return Popup.Create_popup(null, "재판부 의견을 정확히 입력해 주세요.", "창닫기");
    }

    if (this.state.otherSide === null || this.state.otherSide === undefined) {
      return Popup.Create_popup(
        null,
        "상대방측 의견을 정확히 입력해 주세요.",
        "창닫기"
      );
    }

    if (
      dateOfNextHearing[0] === null ||
      dateOfNextHearing[0] === undefined ||
      dateOfNextHearing[1] === null ||
      dateOfNextHearing[1] === undefined ||
      dateOfNextHearing[2] === null ||
      dateOfNextHearing[2] === undefined ||
      dateOfNextHearing[3] === null ||
      dateOfNextHearing[3] === undefined ||
      dateOfNextHearing[4] === null ||
      dateOfNextHearing[4] === undefined
    ) {
      return Popup.Create_popup(
        null,
        "차기변론기일을 정확히 입력해 주세요.",
        "창닫기"
      );
    }

    if (
      this.state.otherThings === null ||
      this.state.otherThings === undefined ||
      this.state.otherThings === ""
    ) {
      return Popup.Create_popup(
        null,
        "기타사항을 정확히 입력해 주세요.",
        "창닫기"
      );
    }

    let date_ = `${dateOfNextHearing[0]}-${(
      "00" + dateOfNextHearing[1].toString()
    ).slice(-2)}-${("00" + dateOfNextHearing[2].toString()).slice(-2)} ${(
      "00" + dateOfNextHearing[3].toString()
    ).slice(-2)}:${("00" + dateOfNextHearing[4].toString()).slice(-2)}:00`;

    let to_server_ = {
      num: this.state.num,
      user: DataInfo.return_user_num(),
      attendee: this.state.attendee,
      contentsOfdefense: this.state.contentsOfdefense,
      dateOfNextHearing: date_,
      otherSide: this.state.otherSide,
      otherThings: this.state.otherThings,
      place: this.state.city + "-" + this.state.court,
    };
    //로딩 시작
    this.setState({ loading: true });

    console.log("POST 시작");
    let from_server_ = await Util_.cli_to_server(
      "/view_results/req_write",
      to_server_,
      "POST"
    );

    if (from_server_.success) {
      this.closeModalView();
      DataInfo.page_move(5, "나의 이력", false);
    } else {
      return Popup.Create_popup(null, "서버에러", "창닫기");
    }
  };
  openModalView = () => {
    this.setState({ isModalViewOpen: true });
  };

  closeModalView = () => {
    this.setState({ isModalViewOpen: false });
  };

  handleAttendeeChange = (value) => {
    this.setState({
      attendee: value,
    });
  };

  handleContentsOfDefenseChange = (value) => {
    this.setState({
      contentsOfdefense: value,
    });
  };

  handleOtherSideChange = (value) => {
    this.setState({
      otherSide: value,
    });
  };

  handleDateOfNextHearingChange = (index_, value) => {
    // -> 차기 변론일 부분
    this.state.dateOfNextHearing[index_] = value;
    this.setState(this.state);
  };

  handleOtherThingsChange = (value) => {
    this.setState({
      otherThings: value,
    });
  };

  handleCityChange = (value) => {
    console.log("value : ", value);
    this.setState({
      city: value,
    });
  };

  handleCourtChange = (value) => {
    this.setState({
      court: value,
    });
  };

  componentDidMount() {
    if (DataInfo.get_public_memmory().place !== null) {
      this.setState({
        city: DataInfo.get_public_memmory().place?.split("-")[0],
        court: DataInfo.get_public_memmory().place?.split("-")[1],
      });
    }
  }

  render() {
    return (
      <div id="view_results_mid">
        <div className="view_results_container">
          <Attendee
            handleAttendeeChange={this.handleAttendeeChange}
            attendee={this.state.attendee}
          />
          <ContentsOfDefense
            handleContentsOfDefenseChange={this.handleContentsOfDefenseChange}
            handleOtherSideChange={this.handleOtherSideChange}
            handleDateOfNextHearingChange={this.handleDateOfNextHearingChange}
            contentsOfdefense={this.state.contentsOfdefense}
            otherSide={this.state.otherSide}
            dateOfNextHearing={this.state.dateOfNextHearing}
          />
          <PlaceModal
            handleCityChange={this.handleCityChange}
            handleCourtChange={this.handleCourtChange}
            place={this.state.place}
          />
          <OtherThings
            handleOtherThingsChange={this.handleOtherThingsChange}
            otherThings={this.state.otherThings}
          />
          <button
            id="total"
            className="button_style1"
            onClick={this.openModalView}
          >
            등록하기
          </button>

          <ModalPortal>
            <ViewResultsFinishedModal
              isOpen={this.state.isModalViewOpen}
              close={this.closeModalView}
              Action_confirm_data={this.Action_confirm_data}
              loading={this.state.loading}
            />
          </ModalPortal>
        </div>
      </div>
    );
  }
}

export default withRouter(ViewResults);
