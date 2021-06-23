import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import "../stylesheets/write_double_agent.css";
import category from "./write_double_agent_context";
import Util_ from "./class/GlobalFtn";
import Popup from "./class/Popup";
import { withRouter } from "react-router-dom";

var e_ = React.createElement;
var appRoot = document.getElementById("write_double_agent_mid");
var modalRoot = document.getElementById("popup_render_place");

class ModalPortal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      // A DOM element
      this.el
    );
  }
}

class WriteDoubleAgent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category,
      num: null,
      isModalPlaceOpen: false,
      isModalDateOpen: false,
      isModalSelected: null,
      selected: null,
      courtInput: null,
      dateCheck: false,
      dateInput: null,
      caseNum: null,
      parties: null,
      party: null,
      partyChecked: null,
      cost: null,
      textElse: null,
      memo: null,
      place1: null,
      place2: null,
      du_date: null,
      temp_: Object.values(Util_.category_to_string("place")).slice(1),
    };

    this.openModalPlace = this.openModalPlace.bind(this);
    this.openModalDate = this.openModalDate.bind(this);
    this.closeModalPlace = this.closeModalPlace.bind(this);
    this.handleCityUpdate = this.handleCityUpdate.bind(this);
    // this.handleDateUpdate = this.handleDateUpdate.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleCourtChange = this.handleCourtChange.bind(this);
    this.handleDateCheckChange = this.handleDateCheckChange.bind(this);
    this.handleCaseNumChange = this.handleCaseNumChange.bind(this);
    this.handlePartyChange = this.handlePartyChange.bind(this);
    this.handlePartyCheckChange = this.handlePartyCheckChange.bind(this);
    this.handleCostChange = this.handleCostChange.bind(this);
    this.handleElseChange = this.handleElseChange.bind(this);
    this.handleMemoChange = this.handleMemoChange.bind(this);
  }

  openModalPlace = () => {
    this.setState({ isModalPlaceOpen: true });
  };

  openModalDate = () => {
    this.setState({ isModalDateOpen: true });
  };

  closeModalPlace = () => {
    this.setState({ isModalPlaceOpen: false });
  };

  closeModalDate = () => {
    this.setState({ isModalDateOpen: false });
  };

  handleCityUpdate = (array) => {
    this.setState((state) => ({
      isModalSelected: array.indexOf(true) + 1,
    }));
  };

  handleDateUpdate = (date) => {
    console.log(date);
    let compareDateFirst =
      ("00" + date.month).slice(-2) +
      "/" +
      ("00" + date.date).slice(-2) +
      "/" +
      date.year +
      " " +
      ("00" + date.hour).slice(-2) +
      ":" +
      ("00" + date.minute).slice(-2) +
      ":00";
    let compareDateSecond =
      ("00" + (new Date().getMonth() + 1)).slice(-2) +
      "/" +
      ("00" + new Date().getDate()).slice(-2) +
      "/" +
      new Date().getFullYear() +
      " " +
      ("00" + new Date().getHours()).slice(-2) +
      ":" +
      ("00" + new Date().getMinutes()).slice(-2) +
      ":00";
    console.log("comapre date", compareDateFirst);
    console.log("date now : ", compareDateSecond);
    //현재시간보다 입력시간이 클때
    if (Date.parse(compareDateFirst) > Date.parse(compareDateSecond)) {
      this.setState({
        dateInput:
          date.year +
          "-" +
          ("00" + date.month).slice(-2) +
          "-" +
          ("00" + date.date).slice(-2) +
          " " +
          ("00" + date.hour).slice(-2) +
          ":" +
          ("00" + date.minute).slice(-2) +
          ":00",
      });
    }

    //현재시간보다 입력시간이 작을때
    if (Date.parse(compareDateFirst) <= Date.parse(compareDateSecond)) {
      Popup.Create_popup(
        null,
        "도래하는 변론기일에 대하여만 신청하실 수 있습니다.",
        "창닫기"
      );

      this.setState({
        dateInput: null,
      });
    }
  };

  handleSelectChange = (e) => {
    this.setState({ selected: e.target.value });
  };

  handleCourtChange = (e) => {
    this.setState({ courtInput: e.target.value });
  };

  handleDateCheckChange = (e) => {
    this.setState({ dateCheck: e.target.checked });
  };

  handleCaseNumChange = (e) => {
    this.setState({
      caseNum: e.target.value,
    });
  };

  handlePartyChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  handlePartyCheckChange = (array) => {
    this.setState({ partyChecked: array.indexOf(true) }, () => {
      console.log(this.state.partyChecked);
    });
  };

  handleCostChange = (value) => {
    this.setState({
      cost: value,
    });
  };

  handleElseChange = (value) => {
    this.setState({
      textElse: value,
    });
  };

  handleMemoChange = (value) => {
    this.setState({
      memo: value,
    });
  };

  //==========================================
  componentDidMount() {
    if (DataInfo.return_page_num() != 7) {
      console.log("not page 7, re init");
      this.props.page_move(7, "복대리 작성", false, false);
    }

    console.log(
      "first componentdidmount public memory : ",
      DataInfo.get_public_memmory()
    );

    //수정부분 6/4 18:28===============================
    if (DataInfo.get_public_memmory() !== null) {
      this.setState({
        type: DataInfo.get_public_memmory().type
          ? DataInfo.get_public_memmory().type
          : null,
        num: DataInfo.get_public_memmory().num
          ? DataInfo.get_public_memmory().num
          : null,
        isModalPlaceOpen: false,
        isModalDateOpen: false,
        isModalSelected: DataInfo.get_public_memmory().category
          ? DataInfo.get_public_memmory().category
          : null,
        selected: DataInfo.get_public_memmory().place1
          ? DataInfo.get_public_memmory().place1
          : null,
        courtInput: DataInfo.get_public_memmory().place2
          ? DataInfo.get_public_memmory().place2
          : null,
        dateCheck: false,
        dateInput: DataInfo.get_public_memmory().du_date
          ? new Date(DataInfo.get_public_memmory().du_date).getFullYear() +
            "-" +
            (
              "00" +
              (new Date(DataInfo.get_public_memmory().du_date).getMonth() + 1)
            ).slice(-2) +
            "-" +
            (
              "00" + new Date(DataInfo.get_public_memmory().du_date).getDate()
            ).slice(-2) +
            " " +
            (
              "00" + new Date(DataInfo.get_public_memmory().du_date).getHours()
            ).slice(-2) +
            ":" +
            (
              "00" +
              new Date(DataInfo.get_public_memmory().du_date).getMinutes()
            ).slice(-2) +
            ":00"
          : null,
        caseNum: DataInfo.get_public_memmory().case_num
          ? DataInfo.get_public_memmory().case_num
          : null,
        parties: DataInfo.get_public_memmory().oponent
          ? DataInfo.get_public_memmory().oponent
          : null,
        party: DataInfo.get_public_memmory().party_name
          ? DataInfo.get_public_memmory().party_name
          : null,
        partyChecked: DataInfo.get_public_memmory().party_position
          ? DataInfo.get_public_memmory().party_position
          : 0,
        cost: DataInfo.get_public_memmory().cost
          ? String(DataInfo.get_public_memmory().cost)
              .replace(/[^0-9]/g, "")
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : null,
        textElse: DataInfo.get_public_memmory().else
          ? DataInfo.get_public_memmory().else
          : null,
        memo: DataInfo.get_public_memmory().memo
          ? DataInfo.get_public_memmory().memo
          : null,
        place1: DataInfo.get_public_memmory().place2
          ? DataInfo.get_public_memmory().place2
          : null,
        place2: DataInfo.get_public_memmory().place2
          ? DataInfo.get_public_memmory().place2
          : null,
        du_date: DataInfo.get_public_memmory().du_date
          ? DataInfo.get_public_memmory().du_date
          : null,
      });
      console.log(
        "second componentdidmount public memory : ",
        DataInfo.get_public_memmory()
      );
    }
    //================================================
  }

  render() {
    const { page_move } = this.props;

    return e_(
      "div",
      { className: "write_double_agent_mid" },
      //복대리 작성
      e_(PageLabel),
      //장소, 도시선택, 기관명 ,법정
      e_(
        "div",
        {
          className: "write_double_agent_container content_preshow_container",
        },
        e_(
          "div",
          {
            id: "write_double_agent_place",
            className: "button_style2 place_right",
            onClick: this.openModalPlace,
          },
          "+ " +
            (this.state.isModalSelected
              ? this.state.temp_[this.state.isModalSelected - 1]
              : "도시 선택")
        ),
        e_(
          ModalPortal,
          null,
          e_(
            ModalPlace,
            {
              ref: popup_render_place,
              isOpen: this.state.isModalPlaceOpen,
              close: this.closeModalPlace,
              handleCityUpdate: this.handleCityUpdate,
            },
            null
          )
        ),
        e_("div", { className: "write_double_agent_label" }, "장소"),
        e_(
          "div",
          { className: "small_text" },
          e_("label", null, "기관명"),
          this.state.isModalSelected
            ? e_(
                "select",
                {
                  id: "write_double_agent_institute1",
                  className: "double_confirm_data input_style1 place_right",
                  type: "text",
                  placeholder: "ex)서울중앙지방법원, 충북지방경찰청",
                  onChange: this.handleSelectChange,
                },
                //select -> option 부분
                e_("option", { value: "DEFAULT" }, "법원을 선택해주세요"),
                this.state.category[this.state.isModalSelected].map((x, y) =>
                  e_(
                    "option",
                    {
                      key: y,
                      value: x,
                      selected: this.state.selected
                        ? this.state.selected == x
                        : null,
                    },
                    x
                  )
                )
              )
            : e_("input", {
                id: "write_double_agent_institute1",
                className: "double_confirm_data input_style1 place_right",
                type: "text",
                placeholder: "도시를 먼저 선택해주세요",
              })
        ),
        e_("br", null),
        e_(
          "div",
          { className: "small_text" },
          e_("label", null, "법  정"),
          e_("input", {
            id: "write_double_agent_institute2",
            className: "double_confirm_data input_style1 place_right",
            type: "text",
            placeholder: "ex)214 호",
            onChange: this.handleCourtChange,
            value: this.state.courtInput,
          })
        ),
        e_("div", {
          id: "status_place",
          className: "status_box double_confirm_data",
        })
      ),
      e_(
        "div",
        {
          className: "write_double_agent_container content_preshow_container",
        },
        e_(
          "div",
          {
            id: "write_double_agent_date",
            className: "button_style2 place_right",
            onClick: this.openModalDate,
          },
          "+기일 선택"
        ),
        e_(
          ModalPortal,
          null,
          e_(
            ModalDate,
            {
              isOpen: this.state.isModalDateOpen,
              close: this.closeModalDate,
              isChecked: this.state.dateCheck,
              handleDateUpdate: this.handleDateUpdate,
            },
            null
          )
        ),
        e_("div", { className: "write_double_agent_label" }, "D-day"),
        e_(
          "div",
          { className: "small_text" },
          e_("label", null, "긴급(오늘 복대리)"),
          e_(
            "div",
            { className: "checkbox" },
            e_("input", {
              id: "urgent_check",
              type: "checkbox",
              onChange: (e) => this.handleDateCheckChange(e),
              defaultChecked: this.state.dateCheck,
            })
          )
        ),
        this.state.dateInput
          ? e_(
              "div",
              {
                id: "status_date",
                className: "status_box double_confirm_data",
              },
              this.state.dateInput
            )
          : null,
        DataInfo.get_public_memmory()
          ? DataInfo.get_public_memmory().du_date !== null &&
            this.state.dateInput === null
            ? e_(
                "div",
                {
                  id: "status_date",
                  className: "status_box double_confirm_data",
                },
                new Date(DataInfo.get_public_memmory().du_date).getFullYear() +
                  "-" +
                  (
                    "00" +
                    (new Date(
                      DataInfo.get_public_memmory().du_date
                    ).getMonth() +
                      1)
                  ).slice(-2) +
                  "-" +
                  (
                    "00" +
                    new Date(DataInfo.get_public_memmory().du_date).getDate()
                  ).slice(-2) +
                  " " +
                  (
                    "00" +
                    new Date(DataInfo.get_public_memmory().du_date).getHours()
                  ).slice(-2) +
                  ":" +
                  (
                    "00" +
                    new Date(DataInfo.get_public_memmory().du_date).getMinutes()
                  ).slice(-2) +
                  ":00"
              )
            : null
          : null
      ),
      e_(
        "div",
        {
          className: "write_double_agent_container content_preshow_container",
        },
        e_(
          "div",
          { className: "small_text" },
          e_("label", null, "사건번호"),
          e_("input", {
            id: "write_double_agent_caseNum",
            className: "double_confirm_data input_style1 place_right",
            type: "text",
            placeholder: "ex)2018가합573792",
            onChange: this.handleCaseNumChange,
            value: this.state.caseNum,
          })
        )
      ),
      //참여
      e_(Party, {
        handlePartyChange: this.handlePartyChange,
        handlePartyCheckChange: this.handlePartyCheckChange,
        party: this.state.party,
        parties: this.state.parties,
      }),
      //금 원정
      e_(Cost, {
        handleCostChange: this.handleCostChange,
        cost: this.state.cost,
      }),
      e_(TextElse, {
        handleElseChange: this.handleElseChange,
        textElse: this.state.textElse,
      }),
      e_(Memo, {
        handleMemoChange: this.handleMemoChange,
        memo: this.state.memo,
      }),
      e_(
        FinishSubmitButton,
        {
          page_move: page_move,
          type: this.state.type,
          num: this.state.num,
          isModalSelected: this.state.isModalSelected,
          data: this.state.selected,
          court: this.state.courtInput,
          date: this.state.dateInput,
          caseNum: this.state.caseNum,
          party: this.state.party,
          partyChecked: this.state.partyChecked,
          parties: this.state.parties,
          cost: this.state.cost,
          textElse: this.state.textElse,
          memo: this.state.memo,
          history: this.props.history,
        },
        null
      )
    );
  }
}

function PageLabel() {
  return e_(
    "div",
    { id: "write_double_agent" },
    e_(
      "div",
      { className: "inline_container" },
      e_("h3", null, "복대리"),
      e_("div", null, "작성")
    )
  );
}

class Party extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //중복 체크 방지
      partyChecked: (
        DataInfo.get_public_memmory()
          ? DataInfo.get_public_memmory().party_position
          : null
      )
        ? new Array(2)
            .fill()
            .map((_, i) =>
              i === DataInfo.get_public_memmory().party_position ? true : false
            )
        : new Array(2).fill().map((_, i) => !i),
    };
  }

  onPartyCheckChange(e, changedIndex) {
    var { checked } = e.target;

    this.setState(
      (state) => ({
        partyChecked: state.partyChecked.map((_, i) =>
          i === changedIndex ? checked : false
        ),
      }),
      () => {
        this.props.handlePartyCheckChange(this.state.partyChecked);
      }
    );
  }

  onPartyChange = (e, name) => {
    this.props.handlePartyChange(name, e.target.value);
  };

  onPartiesChange = (e, name) => {
    this.props.handlePartyChange(name, e.target.value);
  };

  render() {
    const { partyChecked } = this.state;
    const partyList = ["원고", "피고"];
    const { party, parties } = this.props;
    return e_(
      "div",
      {
        className: "write_double_agent_container content_preshow_container",
      },
      e_("div", { className: "write_double_agent_label" }, "참여"),
      e_(
        "div",
        { className: "small_text" },
        e_("label", { className: "small_text" }, "당사자"),
        e_("input", {
          id: "write_double_agent_user1",
          className: "double_confirm_data input_style1 place_right",
          type: "text",
          placeholder: "당사자명 입력",
          onChange: (e) => this.onPartyChange(e, "party"),
          value: party,
        })
      ),
      e_("div", { id: "write_double_agent_user2" }),

      (
        DataInfo.get_public_memmory()
          ? DataInfo.get_public_memmory().party_position
          : null
      )
        ? e_(
            "div",
            null,
            partyChecked.map((item, i) =>
              e_(
                "label",
                { key: i },
                e_("input", {
                  type: "checkbox",
                  name: "position",
                  checked: item,
                  onChange: (e) => this.onPartyCheckChange(e, i),
                }),
                e_("span", { className: "small_text" }, partyList[i])
              )
            )
          )
        : e_(
            "div",
            null,
            partyChecked.map((item, i) =>
              e_(
                "div",
                { className: "boxcheck" },
                e_(
                  "label",
                  { key: i },
                  e_("input", {
                    type: "checkbox",
                    name: "position",
                    checked: item,
                    onChange: (e) => this.onPartyCheckChange(e, i),
                  }),
                  e_(
                    "div",
                    { className: "position" },
                    e_("span", { className: "small_text" }, partyList[i])
                  )
                )
              )
            )
          ),
      e_("br", null),
      e_(
        "div",
        { className: "small_text" },
        e_("label", null, "상대방:"),
        e_("input", {
          id: "write_double_agent_user3",
          className: "double_confirm_data input_style1 place_right",
          type: "text",
          placeholder: "ex)주식회사A",
          onChange: (e) => this.onPartiesChange(e, "parties"),
          value: parties,
        })
      )
    );
  }
}

class Cost extends React.Component {
  constructor(props) {
    super(props);
  }

  onCostChange = (e) => {
    console.log(e.target.value);
    if (e.target.value !== "e") {
      this.props.handleCostChange(
        e.target.value
          .replace(/[^0-9]/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }
  };

  render() {
    const { cost } = this.props;
    return e_(
      "div",
      {
        className: "write_double_agent_container content_preshow_container",
      },
      e_("label", { className: "small_text" }, "금 "),
      e_("input", {
        id: "write_double_agent_price",
        className: "double_confirm_data input_style2",
        type: "text",
        placeholder: "금액(숫자만) 입력",
        onChange: (e) => this.onCostChange(e),
        value: cost,
      }),
      e_("label", { className: "small_text" }, "원")
    );
  }
}

class TextElse extends React.Component {
  constructor(props) {
    super(props);
  }

  onElseChange = (e) => {
    this.props.handleElseChange(e.target.value);
  };

  render() {
    const { textElse } = this.props;
    return e_(
      "div",
      {
        className: "write_double_agent_container content_preshow_container",
      },
      e_("div", { className: "write_double_agent_label" }, "사건개요"),
      e_("textarea", {
        id: "write_double_agent_else",
        className: "double_confirm_data textarea_style1",
        placeholder: "여기에 작성해주세요",
        onChange: (e) => this.onElseChange(e),
        value: textElse,
      })
    );
  }
}

class Memo extends React.Component {
  constructor(props) {
    super(props);
  }

  onMemoChange = (e) => {
    this.props.handleMemoChange(e.target.value);
  };

  render() {
    const { memo } = this.props;
    return e_(
      "div",
      {
        className: "write_double_agent_container content_preshow_container",
      },
      e_("div", { className: "write_double_agent_label" }, "전달사항"),
      e_("textarea", {
        id: "write_double_agent_else",
        className: "double_confirm_data textarea_style1",
        placeholder: "여기에 작성해주세요",
        onChange: (e) => this.onMemoChange(e),
        value: memo,
      })
    );
  }
}

class ModalPlace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkboxes: (
        DataInfo.get_public_memmory()
          ? DataInfo.get_public_memmory().category
          : null
      )
        ? new Array(17)
            .fill()
            .map((_, i) =>
              i === DataInfo.get_public_memmory().category - 1 ? true : false
            )
        : new Array(17).fill().map((_, i) => !i),
      temp_: Object.values(Util_.category_to_string("place")).slice(1),
    };
  }

  onCityChange(e, changedIndex) {
    var { checked } = e.target;

    this.setState((state) => ({
      checkboxes: state.checkboxes.map((_, i) =>
        i === changedIndex ? checked : false
      ),
    }));
  }

  render() {
    var { checkboxes } = this.state;
    var { isOpen, close, handleCityUpdate } = this.props;

    return isOpen
      ? e_(
          "div",
          {
            id: "glass_background",
            className: "glass_black",
          },
          e_(
            "div",
            { className: "popup_box" },
            e_("div", { className: "popup_title normal_text" }, "지역 선택"),
            e_(
              "div",
              { className: "popup_content normal_text" },
              e_(
                "div",
                { className: "popup_checkbox_content" },
                checkboxes.map((item, i) =>
                  e_(
                    "div",
                    { key: i },
                    e_(
                      "label",
                      {
                        className: "none_display_checkbox_label",
                      },
                      e_("input", {
                        type: "checkbox",
                        className: "popup_confirm_data",
                        name: "place",
                        checked: item,
                        onChange: (e) => this.onCityChange(e, i),
                      }),
                      e_(
                        "span",
                        { className: "normal_text" },
                        this.state.temp_[i]
                      )
                    )
                  )
                )
              ),
              e_(
                "div",
                {
                  className: "popup_button_container inline_container",
                },
                e_(
                  "div",
                  {
                    id: "popup_button_confirm",
                    className: "popup_button",
                    onClick: close,
                  },
                  "취소"
                ),
                e_(
                  "div",
                  {
                    id: "popup_button_cancel",
                    className: "popup_button",
                    onClick: () => {
                      handleCityUpdate(checkboxes);
                      close();
                    },
                  },
                  "선택"
                )
              )
            )
          )
        )
      : null;
  }
}

class ModalDate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      year: null,
      month: null,
      date: null,
      hour: null,
      minute: null,
    };
  }

  onDateChange = (e, name) => {
    this.setState(
      {
        [name]: e.target.value,
      },
      () => {
        if (this.state.year?.length === 4) {
          if (
            Number(this.state.year) < 2021 ||
            Number(this.state.year) > 2022
          ) {
            this.resetDateInput("year");
          }
        }

        if (Number(this.state.month) > 12 || Number(this.state.month) < 1) {
          this.resetDateInput("month");
        }
        if (Number(this.state.date) > 31 || Number(this.state.date) < 1) {
          this.resetDateInput("date");
        }
        if (Number(this.state.hour) > 24 || Number(this.state.hour) < 1) {
          this.resetDateInput("hour");
        }
        if (Number(this.state.minute) > 60 || Number(this.state.minute) < 0) {
          this.resetDateInput("minute");
        }
      }
    );
  };

  resetDateInput = (name) => {
    this.setState({
      [name]: "",
    });
  };

  render() {
    var { isOpen, close, isChecked, handleDateUpdate } = this.props;
    var newDate = new Date();
    var date = newDate.getDate();
    var month = newDate.getMonth() + 1;
    var year = newDate.getFullYear();
    var ifCheckedModal;

    if (isChecked === true) {
      ifCheckedModal = e_(
        "div",
        {
          id: "glass_background",
          className: "glass_black",
        },
        e_(
          "div",
          { className: "popup_box" },
          e_("div", { className: "popup_title normal_text" }, "시간 선택"),
          e_(
            "div",
            { className: "popup_content normal_text" },
            e_(
              "div",
              { className: "popup_date_content" },
              e_(
                "div",
                {
                  id: "input_date",
                  className: "normal_text",
                },
                e_("input", {
                  className: "popup_confirm_date input_style1",
                  type: "text",
                  placeholder: "yyyy",
                  value: year,
                  onChange: (e) => this.onDateChange(e, "year"),
                }),
                "/",
                e_("input", {
                  className: "popup_confirm_date input_style1",
                  type: "text",
                  placeholder: "mm",
                  value: month,
                  onChange: (e) => this.onDateChange(e, "month"),
                }),
                "/",
                e_("input", {
                  className: "popup_confirm_date input_style1",
                  type: "text",
                  placeholder: "dd",
                  value: date,
                  onChange: (e) => this.onDateChange(e, "date"),
                }),
                "-",
                e_("input", {
                  className: "popup_confirm_date input_style1",
                  type: "text",
                  placeholder: "hh",
                  onChange: (e) => this.onDateChange(e, "hour"),
                }),
                ":",
                e_("input", {
                  className: "popup_confirm_date input_style1",
                  type: "text",
                  placeholder: "mm",
                  onChange: (e) => this.onDateChange(e, "minute"),
                })
              )
            ),
            e_(
              "div",
              {
                className: "popup_button_container inline_container",
              },

              e_(
                "div",
                {
                  id: "popup_button_cancel",
                  className: "popup_button",
                  onClick: () => {
                    handleDateUpdate({
                      ...this.state,
                      year: newDate.getFullYear(),
                      month: newDate.getMonth() + 1,
                      date: newDate.getDate(),
                    });
                    close();
                  },
                },
                "선택"
              ),
              e_(
                "div",
                {
                  id: "popup_button_confirm",
                  className: "popup_button",
                  onClick: close,
                },
                "취소"
              )
            )
          )
        )
      );
    } else {
      ifCheckedModal = e_(
        "div",
        {
          id: "glass_background",
          className: "glass_black",
        },
        e_(
          "div",
          { className: "popup_box" },
          e_("div", { className: "popup_title normal_text" }, "시간 선택"),
          e_(
            "div",
            { className: "popup_content normal_text" },
            e_(
              "div",
              { className: "popup_date_content" },
              e_(
                "div",
                {
                  id: "input_date",
                  className: "normal_text",
                },
                e_("input", {
                  className: "popup_confirm_date input_style1",
                  type: "text",
                  placeholder: "yyyy",
                  onChange: (e) => this.onDateChange(e, "year"),
                  value: this.state.year,
                }),
                "/",
                e_("input", {
                  className: "popup_confirm_date input_style1",
                  type: "text",
                  placeholder: "mm",
                  onChange: (e) => this.onDateChange(e, "month"),
                  value: this.state.month,
                }),
                "/",
                e_("input", {
                  className: "popup_confirm_date input_style1",
                  type: "text",
                  placeholder: "dd",
                  onChange: (e) => this.onDateChange(e, "date"),
                  value: this.state.date,
                }),
                "-",
                e_("input", {
                  className: "popup_confirm_date input_style1",
                  type: "text",
                  placeholder: "hh",
                  onChange: (e) => this.onDateChange(e, "hour"),
                  value: this.state.hour,
                }),
                ":",
                e_("input", {
                  className: "popup_confirm_date input_style1",
                  type: "text",
                  placeholder: "mm",
                  onChange: (e) => this.onDateChange(e, "minute"),
                  value: this.state.minute,
                })
              )
            ),
            e_(
              "div",
              {
                className: "popup_button_container inline_container",
              },
              e_(
                "div",
                {
                  id: "popup_button_cancel",
                  className: "popup_button",
                  onClick: () => {
                    handleDateUpdate(this.state);
                    close();
                  },
                },
                "선택"
              ),
              e_(
                "div",
                {
                  id: "popup_button_confirm",
                  className: "popup_button",
                  onClick: close,
                },
                "취소"
              )
            )
          )
        )
      );
    }

    return isOpen ? ifCheckedModal : null;
  }
}

class FinishSubmitButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFinishClick: false,
    };

    this.handleRedirectClick = this.handleRedirectClick.bind(this);
    this.onClickFinishButton = this.onClickFinishButton.bind(this);
  }

  onClickFinishButton() {
    this.setState({
      isFinishClick: !this.state.isFinishClick,
    });
  }

  handleRegisteringClick = (e) => {
    const num = this.props.num;
    const dataPlace =
      this.props?.data + "-" + this.props.court?.replace(" ", "");
    const dataDate = this.props.date;
    const category = this.props.isModalSelected;
    const caseNum = this.props.caseNum;
    const partyName = this.props.party;
    const oponent = this.props.parties;
    const partyChecked = this.props.partyChecked ? this.props.partyChecked : 0;
    const cost = this.props.cost;
    const textElse = this.props.textElse;
    const memo = this.props.memo;

    console.log("partychecked : ", partyChecked);

    this.setState(
      {
        SendData: {
          num: num,
          user: DataInfo.return_user_num(),
          category: category,
          place: dataPlace,
          du_date: dataDate,
          case_num: caseNum,
          party_name: partyName,
          party_position: partyChecked,
          oponent: oponent,
          cost: cost?.replace(/,/gi, ""),
          else: textElse,
          memo: memo,
        },
      },
      () => {
        this.handleRedirectClick();
      }
    );
  };

  async before_send_to_server_popup(pass_ = 0) {
    var revise_ = pass_;
    console.log(revise_);

    //수정부분 6/4 18ㅣ23============
    switch (revise_) {
      case 0:
        var url_ = "/write_double_agent/write_path";
        break;
      case 1:
        var url_ = "/write_double_agent/revise_path";
        break;
      case 2:
        var url_ = "/write_double_agent/second_path";
        break;
      case 3:
        var url_ = "/write_double_agent/revise_second_path";
        break;
    }
    //============================

    console.log("url_ : ", url_);
    console.log("write_double SendData : ", this.state.SendData);

    var from_server_ = await Util_.cli_to_server(
      url_,
      this.state.SendData,
      "POST"
    );

    if (from_server_.success) {
      if (revise_ === 1 || revise_ === 3) {
        if (DataInfo.return_before_page_num() === 1) {
          await Util_.update_data_from_dataSource(
            DataInfo.Page_memmory[DataInfo.PAGEOBJNAME[1]]?.ResArr,
            this.state.sendData.num,
            this.state.sendData,
            Util_.dbdi("num")
          );
        }
        DataInfo.page_move(
          "before",
          DataInfo.return_before_page_num() === 1 ? "복대리" : "나의 이력",
          false
        );
      } else {
        DataInfo.page_move(1, "복대리", false);
        Popup.Create_popup(
          null,
          this.revise_flag ? "글 수정 성공" : "글 작성 성공",
          "창 닫기"
        );
      }
    }
    if (!from_server_.success) {
      Popup.Create_popup(null, from_server_.message, "창닫기");
      return;
    }
  }

  handleRedirectClick = (e) => {
    if (this.state.SendData.user === null) {
      return Popup.Create_popup(null, Util_.text_with_newline("서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요."), "창닫기");
    }
    if (
      this.props.data === null ||
      this.props.data === undefined ||
      this.props.data === "DEFAULT"
    ) {
      return Popup.Create_popup(null, "기관명을 정확히 선택해 주세요.", "창닫기");
    }
    if (
      this.state.SendData.category === null ||
      this.state.SendData.category === ""
    ) {
      return Popup.Create_popup(null, "지역을 정확히 선택해 주세요.", "창닫기");
    }
    if (this.props.court === null || this.props.court === "") {
      return Popup.Create_popup(null, "법정을 정확히 선택해 주세요.", "창닫기");
    }
    if (
      this.state.SendData.du_date === null ||
      this.state.SendData.du_date === ""
    ) {
      return Popup.Create_popup(null, "날짜를 정확히 입력해 주세요.", "창닫기");
    }
    if (
      this.state.SendData.case_num === null ||
      this.state.SendData.case_num === ""
    ) {
      return Popup.Create_popup(
        null,
        "사건번호를 정확히 입력해 주세요.",
        "창닫기"
      );
    }
    if (
      this.state.SendData.party_name === null ||
      this.state.SendData.party_name === ""
    ) {
      return Popup.Create_popup(
        null,
        "당사자를 정확히 입력해 주세요.",
        "창닫기"
      );
    }
    if (
      this.state.SendData.party_position === null ||
      this.state.SendData.party_position === ""
    ) {
      return Popup.Create_popup(
        null,
        "원고 또는 피고를 선택해 주세요.",
        "창닫기"
      );
    }
    if (
      this.state.SendData.oponent === null ||
      this.state.SendData.oponent === ""
    ) {
      return Popup.Create_popup(null, "상대방을 정확히 입력해 주세요.", "창닫기");
    }
    if (this.state.SendData.cost === null || this.state.SendData.cost === "") {
      return Popup.Create_popup(null, "금액을 확인해 주세요.", "창닫기");
    }
    if (this.state.SendData.else === null || this.state.SendData.else === "") {
      return Popup.Create_popup(
        null,
        "사건개요를 정확히 입력해 주세요.",
        "창닫기"
      );
    }
    if (this.state.SendData.memo === null || this.state.SendData.memo === "") {
      return Popup.Create_popup(
        null,
        "전달사항을 정확히 입력해 주세요.",
        "창닫기"
      );
    }

    //===수정 6/4=18:56===========================
    if (DataInfo.get_public_memmory()?.hasOwnProperty("type")) {
      this.before_send_to_server_popup(DataInfo.get_public_memmory("type"));
    } else {
      this.before_send_to_server_popup(0);
    }
    //============================================
  };

  render() {
    return (
      <Fragment>
        <div
          id="total"
          className="button_style1"
          onClick={this.onClickFinishButton}
        >
          등록하기
        </div>
        {/* 등록하기 누르고 나오는 팝업 */}
        <ModalPortal>
          {this.state.isFinishClick ? (
            <div id="glass_background" className="glass_black">
              <div className="popup_box">
                <div className="popup_title normal_text">등록하기</div>
                <div className="popup_content normal_text">
                  등록하시겠습니까?
                </div>
                <div className="popup_button_container inline_container">
                  <div
                    id="popup_button_cancel"
                    className="popup_button"
                    onClick={this.onClickFinishButton}
                  >
                    취소
                  </div>
                  <div
                    id="popup_button_confirm"
                    className="popup_button"
                    onClick={() => {
                      this.onClickFinishButton();
                      this.handleRegisteringClick();
                    }}
                  >
                    확인
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </ModalPortal>
      </Fragment>
    );
  }
}

export default withRouter(WriteDoubleAgent);
