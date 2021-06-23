import React, { Fragment } from "react";
import Util_ from "../../class/GlobalFtn";
import ModalPortal from "./ModalPortal.jsx";
import category from "../../write_double_agent_context";
import "../../../stylesheets/write_double_agent.css";

class PlaceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category,
      isModalPlaceOpen: false,
      isModalSelected: null,
      courtInput: null,
      selected: null,
      checkboxes: null,
      temp_: null,
    };

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleCourtChange = this.handleCourtChange.bind(this);
    this.onCityChange = this.onCityChange.bind(this);
  }

  openModalPlace = () => {
    this.setState({ isModalPlaceOpen: true });
  };

  closeModalPlace = () => {
    this.setState({ isModalPlaceOpen: false });
  };

  handleCityUpdate = (array) => {
    this.setState((state) => ({
      isModalSelected: array.indexOf(true) + 1,
    }));
  };

  onCityChange(e, changedIndex) {
    var { checked } = e.target;

    this.setState((state) => ({
      checkboxes: state.checkboxes.map((_, i) =>
        i === changedIndex ? checked : false
      ),
    }));
  }

  handleSelectChange = (e) => {
    this.setState({ selected: e.target.value }, () => {
      this.props.handleCityChange(this.state.selected);
    });
  };

  handleCourtChange = (e) => {
    this.setState({ courtInput: e.target.value }, () => {
      this.props.handleCourtChange(this.state.courtInput);
    });
  };

  componentDidMount() {
    this.setState(
      {
        selected: DataInfo.get_public_memmory().place?.split("-")[0],
        isModalSelected: DataInfo.get_public_memmory().category,
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
      },
      () => {
        console.log(DataInfo.get_public_memmory());
        console.log(this.state.checkboxes);
      }
    );
  }

  render() {
    const { checkboxes, isModalPlaceOpen } = this.state;
    return (
      <Fragment>
        <div className="write_double_agent_container content_preshow_container">
          <div
            id="write_double_agent_place"
            className="button_style2 place_right"
            onClick={this.openModalPlace}
          >
            {"+ " +
              (this.state.isModalSelected
                ? this.state.temp_[this.state.isModalSelected - 1]
                : "도시 선택")}
          </div>
          <ModalPortal>
            {isModalPlaceOpen ? (
              <div id="glass_background" className="glass_black">
                <div className="popup_box">
                  <div className="popup_title normal_text">지역 선택</div>
                  <div className="popup_content normal_text">
                    <div className="popup_checkbox_content">
                      {this.state.checkboxes.map((item, i) => {
                        return (
                          <div key={i}>
                            <label className="none_display_checkbox_label">
                              <input
                                type="checkbox"
                                className="popup_confirm_data"
                                name="place"
                                checked={item}
                                onChange={(e) => this.onCityChange(e, i)}
                              ></input>
                              <span className="normal_text">
                                {this.state.temp_[i]}
                              </span>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    <div className="popup_button_container inline_container">
                      <div
                        id="popup_button_confirm"
                        className="popup_button"
                        onClick={this.closeModalPlace}
                      >
                        취소
                      </div>
                      <div
                        id="popup_button_cancel"
                        className="popup_button"
                        onClick={() => {
                          this.handleCityUpdate(checkboxes);
                          this.closeModalPlace();
                        }}
                      >
                        확인
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </ModalPortal>
          <div className="write_double_agent_label">장소</div>
          <div className="small_text">
            <label>기관명</label>
            {this.state.isModalSelected ? (
              <Fragment>
                <select
                  id="write_double_agent_institute1"
                  className="double_confirm_data input_style1 place_right"
                  type="text"
                  placeholder="ex)서울중앙지방법원, 충북지방경찰청"
                  onChange={this.handleSelectChange}
                >
                  <option value="DEFAULT">법원을 선택해주세요</option>
                  {this.state.category[this.state.isModalSelected].map(
                    (x, y) => {
                      return (
                        <option
                          key={y}
                          value={x}
                          selected={
                            this.state.selected
                              ? this.state.selected === x
                              : null
                          }
                        >
                          {x}
                        </option>
                      );
                    }
                  )}
                </select>
              </Fragment>
            ) : (
              <input
                id="write_double_agent_institute1"
                className="double_confirm_data input_style1 place_right"
                type="text"
                placeholder="도시를 먼저 선택해주세요"
              ></input>
            )}
          </div>
        </div>
        <br />
        <div className="view_results_court_container content_preshow_container">
          <div className="write_double_agent_label">법 정</div>
          <input
            id="write_double_agent_institute2"
            className="double_confirm_data input_style1 place_right"
            type="text"
            placeholder="ex)214 호"
            onChange={this.handleCourtChange}
            value={this.state.courtInput}
          ></input>
        </div>
        <div id="status_place" className="status_box double_confirm_data"></div>
      </Fragment>
    );
  }
}

export default PlaceModal;
